function get_team(){
    return fetch(window.location.origin + "/perforator/team");
}
function get_user_peers(id){
    return fetch(window.location.origin  + "/perforator/peers/uid?id=" + id)
}
function get_all_peers(){
    return fetch(window.location.origin + "/perforator/peers/all/");
}
function replace_list_peers(list){
    let window = document.getElementById("peers")
    window.replaceChild(dict_of_list_peers[list], document.getElementById("list_peers"))
    get_user_peers(list)
        .then(response => response.json())
        .then(json => {
            for (let i of json){
                let id = i.user_id;
                save_peers_in_modal_window(list, id);
            }
        });
}


let dict_of_list_peers = {}

window.onload = function () {
    console.log('page loaded');
    get_team()
        .then(response => response.json())
        .then(json => {
            let team_list_not_approve = document.getElementById("team_not_approve");
            let team_list_approve = document.getElementById("team_approve");
            let script_list = document.getElementById("script");
            let el_approve_counter = document.getElementById("approve_users_count");
            let el_not_approve_counter = document.getElementById("not_approve_users_count");
            let approve_counter = 0;
            let not_approve_counter = 0;


            for (let p of json) {
                const allDiv = document.createElement("div");
                const scripts = document.createElement("script");

                allDiv.setAttribute("id", `peer-${p['user_id']}`);
                allDiv.classList.add("peers")
                scripts.innerHTML = `function myFunction${p.user_id}() {
                                        document.getElementById('myDropdown${p.user_id}').classList.toggle('show')};`
                allDiv.innerHTML = `
                    <button onclick="myFunction${p.user_id}()" class="peer dropbtn">
                        <div class="peers-pic">
                            <img class="avatar" src="${p.photo}"/>
                        </div>
                        <span class="name" style="margin-left: 0">${p.username}</span>
                        <a href="#" class="chevron">
                            <i class="fas fa-chevron-right"></i>
                        </a>
                    </button> 
                    <div id="myDropdown${p.user_id}" class="dropdown-content"></div>
                    `;

                script_list.appendChild(scripts)

                if (!p.approve) {
                    team_list_not_approve.appendChild(allDiv);
                    not_approve_counter++;
                }
                else {
                    team_list_approve.appendChild(allDiv);
                    approve_counter++;
                    //continue
                }



                let peers_list = document.createElement("div");
                let peers_tag = document.getElementById(`myDropdown${p.user_id}`)
                let peers_add = document.createElement("div");


                get_all_peers()
                    .then(response => response.json())
                    .then(json => {
                        peers_list.classList.add("dropdown-container")
                        peers_list.setAttribute("id", "my_peers");
                        peers_list.innerHTML = `<div class="dropdown-description">пиры, которых выбрал сотрудник</div>`
                        peers_tag.appendChild(peers_list)

                        let my = document.createElement("div")
                        my.setAttribute("id", "list_peers");

                        for (let u of json) {
                            const peer = document.createElement("div");
                            peer.classList.add("selected-peer")
                            peer.setAttribute("id", `my-peer${p.user_id}${u['user_id']}`);
                            peer.innerHTML = `
                                <img class="selected-peer-avatar" src="${u.photo}"/>
                                 <span class="selected-peer-name">${u.username}</span>`
                            if (!p.approve) {
                                peer.innerHTML += `
                                    <a class="close delete-peer" onclick="remove_peer_remote(${p.user_id}, ${u.user_id})">
                                        <i class="fas fa-times"></i>
                                    </a>`;
                            }
                            peer.style.display = 'none';
                            peers_list.appendChild(peer);

                            const myDiv = document.createElement("div");
                            myDiv.setAttribute("id", `peer${p.user_id}${u.user_id}`);
                            myDiv.innerHTML = `
                                <div class="peer-sel">
                                    <div class="peers-pic">
                                        <img class="avatar" src="${u.photo}"/>
                                    </div>
                                    <div style="margin-top: 0" class="peer-info">${u.username}</div>
                                    <button class="choose" onclick="select_peer_remote(${p.user_id}, ${u.user_id})">Выбрать</button>
                                </div>`;
                            my.appendChild(myDiv);
                        }

                        dict_of_list_peers[p.user_id] = my;

                        peers_add.innerHTML = `
                            <a href="#peers" id="choose${p.user_id}" onclick="replace_list_peers(${p.user_id})">
                                <button class="add-peer">
                                    <i class="icon-plus fas fa-plus"></i>
                                    Добавить пира
                                </button>
                            </a>
                            <input class="accept" type="submit" value="утвердить" onclick="approve_user(${p.user_id})"/>
                            `
                        if (!p.approve) {
                            peers_list.appendChild(peers_add)
                        }


                    })
                    .then(() => {
                        get_user_peers(p.user_id)
                            .then(response => response.json())
                            .then(json => {
                                for (let i of json){
                                    let id = i.user_id;
                                    save_peers(p.user_id, id);
                                }
                            });
                    });
            }
            el_approve_counter.innerHTML = approve_counter.toString();
            el_not_approve_counter.innerHTML = not_approve_counter.toString();
        })
};

function remove_peer_remote(uid, id) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(window.location.origin + `/perforator/peers/delete/user?id=${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify([id])
    })
        .then(response => {
            if (response.ok) {
                console.log(response.json())
                delete_peers(uid, id);
            }
        });
}

// посылаем post-запрос на сервер, что пользователь выбрал пира
function select_peer_remote(uid, id) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(window.location.origin + `/perforator/peers/save/user?id=${uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify([id])
    })
        .then(response => {
            if (response.ok) {
                delete_peers_in_modal_window(uid, id);
            }
        });
}

function approve_user(id) {
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch(window.location.origin + `/perforator/peers/approve?id=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify([id])
    })
        .then(response => {
            if (response.ok) {
                window.location.reload();
            }
        });
}

// удаляем пира, скрываем и показываем нужный элемент
// вызывается при клике, вызывает remove_peer
function delete_peers(uid, id) {
    document.getElementById(`my-peer${uid}${id}`).style.display = 'none';
    //document.getElementById(`peer${uid}${id}`).style.display = 'block';
}
function delete_peers_in_modal_window(uid, id) {
    document.getElementById(`my-peer${uid}${id}`).style.display = 'block';
    document.getElementById(`peer${uid}${id}`).style.display = 'none';
}

// выбираем пира, скрываем и показываем нужный элемент
// вызывается при клике, вызывает select_peer
function save_peers(uid, id) {
    console.log(`my-peer${uid}${id}`)
    document.getElementById(`my-peer${uid}${id}`).style.display = 'block';
    //document.getElementById(`peer${uid}${id}`).style.display = 'none';
}
function save_peers_in_modal_window(uid, id) {
    //console.log(`peer${uid}${id}`)
    //document.getElementById(`my-peer${uid}${id}`).style.display = 'block';
    document.getElementById(`peer${uid}${id}`).style.display = 'none';
}

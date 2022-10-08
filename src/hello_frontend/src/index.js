import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as hello_backend_idl, canisterId as hello_backend_id } from "../../declarations/hello_backend";
import { hello_backend } from "../../declarations/hello_backend";




async function post(){
  let post_button = document.getElementById("post");
  let error = document.getElementById("error");
  error.innerText = "";
  post_button.disabled= true;
  let textarea = document.getElementById("message");
  let otp = document.getElementById("otp").value;
  let text = textarea.value;
  let authorName = document.getElementById("author").value;
  try{
    await hello_backend.set_name(authorName);
    await hello_backend.post(otp,text);
    textarea.value = "";
  } catch (err) {
    console.log(err)
    error.innerText ="Post Failed !";
    
  }
  post_button.disabled = false;
}

var num_posts = 0;
var num_follows = 0;

async function load_posts(){
//let posts_section = document.getElementById("posts");

//显示本地所有的信息
let posts = await hello_backend.posts_all();
if(num_posts == posts.length) return;
//posts_section.replaceChildren([]);
let tbOwn = document.getElementById("TbOwn");
tbOwn.replaceChildren([]);
num_posts = posts.length;

for (var i=0;i<posts.length;i++){
    //let post = document.createElement("P");
    //post.innerText = posts[i].content;
    //posts_section.appendChild(post)
    var tr = document.createElement('tr');
    tbOwn.appendChild(tr);

    //显示作者
    var td = document.createElement('td');
    td.innerHTML = posts[i].author;
    tr.appendChild(td);
    
    //显示时间
    var dateTime = parseInt(posts[i].time);
    var date = new Date(dateTime/1000000);
    td = document.createElement('td');
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds(); 
    td.innerHTML = Y+M+D+h+m+s;
    tr.appendChild(td);

    //显示内容
    td = document.createElement('td');
    td.innerHTML = posts[i].content;
    tr.appendChild(td);
  }
  //显示follow的作者名字
  let follows_section = document.getElementById("follows");
  let follows = await hello_backend.follows();
  if(num_follows == follows.length) return;
  follows_section.replaceChildren([]);
  num_follows = follows.length;

  let agent = new HttpAgent();
  for (var i=0;i<follows.length;i++){
    let follow_section_Child = document.createElement("P");
    let Microblog = Actor.createActor(hello_backend_idl,{agent:agent, canisterId:follows[i]});
    let followName = await Microblog.get_name();
    //follow_section_Child.innerHTML = "<a href='javascript:void(0)' onclick = DisplayFollow("+ follows[i].toText()+ ")>"+followName+"</ a>";
    follow_section_Child.innerHTML = "<a href='javascript:void(0)'>"+followName+"</ a>";
   // follow_section_Child.addEventListener("click",DisplayFollow,false);
   follow_section_Child.addEventListener("click",DisplayFollow,false);
    follow_section_Child.setAttribute('followIDName',follows[i].toText())
    follows_section.appendChild(follow_section_Child)
  }
}

function DisplayFollow1(){
  console.log('test', 11111);
}


async function DisplayFollow(event){

  let followIDName = event.currentTarget.attributes.followIDName.value;
 // console.log(event.currentTarget.attributes.followIDName.value);
  let follows = await hello_backend.follows(); 
  let agent = new HttpAgent();
  for (var i=0;i<follows.length;i++){
    let followId = follows[i].toText();
    if(followId == followIDName)  //表明ID相同
    {
      let tbfollows = document.getElementById("TbFollows");
      tbfollows.replaceChildren([]);
      let Microblog = Actor.createActor(hello_backend_idl,{agent:agent, canisterId:follows[i]});
      let posts = await Microblog.posts_all();
      for (var i=0;i<posts.length;i++){

        var tr = document.createElement('tr');
        tbfollows.appendChild(tr);
    
        //显示作者
        var td = document.createElement('td');
        td.innerHTML = posts[i].author;
        tr.appendChild(td);
        
        //显示时间
        var dateTime = parseInt(posts[i].time);
        var date = new Date(dateTime/1000000);
        td = document.createElement('td');
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds(); 
        td.innerHTML = Y+M+D+h+m+s;
        tr.appendChild(td);
    
        //显示内容
        td = document.createElement('td');
        td.innerHTML = posts[i].content;
        tr.appendChild(td);
      }
      return;
    }
    
  }
}

function load(){
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_posts()
  setInterval(load_posts,3000);
}
window.onload = load
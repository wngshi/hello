/*actor {
  public func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
};
*/

import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

actor {

  public type Message = {
    content:Text;
    author : Text;
    time:Time.Time;
  };

  public type Microblog = actor {
    follow: shared (Principal) -> async();                // 添加关注对象
    follows: shared query () -> async[Principal];         //返回关注列表
    post: shared (Text) -> async();                       //发布新的消息
    posts: shared query (Time.Time) ->async[Message];     //返回所有发布的消息
    timeline: shared(Time.Time)->async [Message];         //返回所有关注对象发布的消息
    set_name :shared (Text) ->async();
    get_name: shared ()->async(Text);
  // followsPrincipalId: shared query () -> async[Text]; //显示principalId 的字符串
  //  messageCaller :shared () -> async Text;
    
  };

  stable var followed : List.List<Principal> = List.nil();
  stable var authorName:Text = "";

  public shared func set_name (author:Text):async (){
    authorName := author;
  };

  public shared query func get_name ():async (Text){
    return authorName;
  };

  public shared func follow (id: Principal) : async () {
    followed := List.push(id, followed);
  };

  public shared query func follows():async [Principal] {
    List.toArray (followed)
  };

 stable var messages: List.List<Message> = List.nil();

  public shared (msg) func post (otp:Text, text: Text) : async () {
    //assert(Principal.toText(msg.caller) == "7w4xi-6nls6-o2gwk-p44rt-hyhqs-jlwlo-lddkp-e2wjz-azmbf-54zcj-hae");
    assert (otp == "123456");
    let message : Message = {
      content = text;
      time = Time.now();
      author = authorName;
      };
     messages := List.push (message, messages)
  };

  public shared query func posts(since: Time.Time): async [Message] {  
    var all : List.List<Message> = List.nil();
    for (msg in Iter.fromList(messages))
    {
      if(msg.time>=since)
      {
        all :=List.push(msg,all);
      }
    };
    List.toArray (all)
  };

    public shared query func posts_all(): async [Message] {  
    var all : List.List<Message> = List.nil();
    for (msg in Iter.fromList(messages))
    {
      all :=List.push(msg,all);
    };
    List.toArray (all)
  };


  public shared func timeline(since: Time.Time) : async [Message] {
    var all : List.List<Message> = List.nil();
    for (id in Iter.fromList(followed)) {
        let canister : Microblog = actor(Principal.toText(id));
        let msgs = await canister.posts(since);
        for (msg in Iter.fromArray(msgs)) 
        {
            all :=List.push(msg,all);
        }
    };
    List.toArray(all)
  };


 /* public shared query func followsPrincipalId():async [Text] {
    
    var all : List.List<Text> = List.nil();
    for (id in Iter.fromList(followed)) {
      all :=List.push(Principal.toText(id),all);
    };
    List.toArray(all)
  };

  public shared (msg) func messageCaller():async Text{
    Principal.toText(msg.caller)
  };
*/


};
import React, { useEffect, useState } from 'react';
import generateAvatar from "github-like-avatar-generator";


function RandomAvatar(props) {
    const[avatar,SetAvatar]=useState()
    useEffect(()=>{
    
     let avatar = generateAvatar({
      blocks: 6, // must be multiple of two
      width: 100
    });
   // console.log(avatar.base64)
   SetAvatar(avatar.base64)
   
       
      
     

    },[])  
    return avatar;
    // return (
        
    //     <div style={{display:"flex",justifyContent:"center",alignItems:"center"}} >
    //         {avatar && <div>     
    //         <img style={{width:"82px",height:"82px",borderRadius:"50px",marginTop:"1px",alignContent:"center",alignSelf:"center",marginTop:"6px"}}
    //     // src={index%3==0 ? FirstUserImage : index%3==1 ? SecondUserImage : ThirdUserImage}
    //      src={avatar}
    //    />
    //             </div>}
          
            
    //     </div>
    // );
}

export default RandomAvatar;
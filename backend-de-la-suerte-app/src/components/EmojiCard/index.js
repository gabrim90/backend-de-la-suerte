

export const EmojiCard = (props) => {
    
    console.log(props)
    return (
        <div className='emoji-item' >
        <div className = 'emoji-icon' onClick = {props.onClickCallback} > 
        {props.emoji.emoji} </div>
        <div className='emoji-description'>{props.emoji.description}</div> 
        </div>
    );

}



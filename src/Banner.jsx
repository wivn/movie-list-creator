import "./Banner.css"
function Banner({numOfNominees}){
	if(numOfNominees >= 5){
		return <div className="banner">Congrats! You have selected 5 or more nominees!</div>
	} else {
		return null
	}
	
}
export default Banner
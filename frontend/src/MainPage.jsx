import Reviews from "./Components/Reviews";
import Header from "./Components/Header";
import Tags from "./Components/TagCloud";

export default function MainPage(){
    return(
        <div>
            <Header />
            <div style={{margin: '1em 0'}}>
                <Tags />
            </div>
            <Reviews />
        </div>
    )
}

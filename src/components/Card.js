import React from "react";
import {Heading} from "grommet/es6";
import './styles/card.css';
import {Badge} from "evergreen-ui";
import pinkArrow from "../assets/pink arrow.svg";
import pinkStar from "../assets/pink star.svg";

class Card extends React.Component {
    constructor(props) {
        super(props);
        this.place = props.place;
        this.index = props.index;
        this.length = props.length;
    }

    prices = {
        "1": "$",
        "2": "$$",
        "3": "$$$",
        "4": "$$$$"
    };

    buildTags() {
        let tags = [];
        let i = 0;

        while(i < this.place.type_list.length) {
            tags.push(<Badge marginRight={8} key={i}>{this.place.type_list[i]}</Badge>);
            i = i + 1;
        }

        return tags;
    }

    buildPriceTag() {
        if(this.place != null){
            let price_value = this.place.price_level;
            let price_tag = this.prices[price_value] || "Unknown Price";
            let color = "green";
            if(price_tag === "Unknown Price") {
                color = "red"
            }
            return (<Badge marginRight={8} color={color} style={{"verticalAlign":"middle"}}>{price_tag}</Badge>)
        }
    }

    render() {
        let image = null;
        if(this.place.image_url) {
            image = this.place.image_url
        }
        let tags = this.buildTags();
        let priceTag = this.buildPriceTag();
        return (
            <div className={`card ${this.length-this.index == 1 ? "first-card" : ""} ${this.length-this.index == 2 ? "second-card" : ""} ${this.length-this.index == 3 ? "third-card" : ""}`} ref={this.place.id} id={this.place.id}>
                <div className="card-image"
                     style={{
                         "backgroundImage": "url(" + image + ")"
                     }}>
                </div>
                <div className="card-details" ref={this.place.id}>
                    <h2>{this.place.name}</h2>
                    <div className="more-info">
                        <div className="values">
                            <div className="address">
                                <img
                                    src={pinkArrow}
                                    style={{
                                        margin: '4px 5px 5px 0px'
                                    }}
                                />
                                {this.place.vicinity}
                            </div>
                            <div className="rating-price">
                                <img
                                    src={pinkStar}
                                    style={{
                                        margin: '6px 5px 5px 0px'
                                    }}
                                />
                                <span>{this.place.rating}</span>
                                <span>{priceTag}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default Card
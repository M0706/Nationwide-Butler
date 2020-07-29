import React from 'react'
import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

class OrderSummary extends React.Component{
    componentDidUpdate(){
        console.log("Ordersummary updation")
    }
    render(){

    let ingredientSummary=Object.keys(this.props.ingredients)
    ingredientSummary=ingredientSummary.map(
        igkey=>{
            return (<li key={igkey}>
                <span style={{textTransform:"capitalize"}}>{igkey}</span>:{this.props.ingredients[igkey]}
            </li>)}
            )
        return(
            <Aux>
        <h>Your Order:</h>
        <p>A delicious Burger with following ingredients :</p>
        <ul>
            {ingredientSummary}
        </ul>
        <p><strong>Total Price: Rs {this.props.price.toFixed(2)}</strong></p>
        <p>continue to Checkout</p>
        <Button btntype="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
        <Button btntype="Success" clicked={this.props.purchaseContinued}>CONTINUE</Button>
    </Aux>

        )
    }
}
export default OrderSummary;
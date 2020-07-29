import React, { Component } from 'react';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'

const INGREDIENT_PRICES = {
    salad: 10,
    cheese: 4,
    meat: 25,
    bacon: 25
};

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        // ingredients: {
        //     salad: 0,
        //     bacon: 0,
        //     cheese: 0,
        //     meat: 0
        // }
        ingredients:null,
        totalPrice: 15,
        purchasable: false, //this is for enabling OrderNow button
        purchasing:false,//This for updating OrderSummary and displaying it after OrderNow Button is clicked
        loading:false
    }

    componentDidMount(){
        axios.get('https://burger-builder-9e56e.firebaseio.com/ingredients.json')
        .then(response=>{
            this.setState({ingredients:response.data}) 
            console.log(this.props)
               })
    }

    //update OrderNow button 
    updatePurchaseState (ingredients) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey];
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        this.setState( { purchasable: sum > 0 } );
    }
    purschasehandler=()=>{
        this.setState({purchasing:true})
    }
    purchaseCancelHandler=()=>{
        this.setState({purchasing:false})
    }
    purchaseContinueHandler=()=>{
        //alert('You continue!');
        this.setState({loading:true})
        const order={
            ingredients:this.state.ingredients,
            price:this.state.totalPrice,

            customer:{
            name:"Dummy",
            address:"Dummyaddress",
            country:"India",
            email:"Dummy@gmail.com"
        },
          deliveryMethod:"fastest"
    }
        axios.post('/orders.json',order).then(
            response=>{this.setState({loading:false,purchasing:false});
        console.log(response)}).catch(
            error=>{this.setState({loading:false,purchasing:false});
            console.log(error)}
            )
        ;
    

    }

    addIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = ( type ) => {
        const oldCount = this.state.ingredients[type];
        if ( oldCount <= 0 ) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
        this.updatePurchaseState(updatedIngredients);
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for ( let key in disabledInfo ) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        // {salad: true, meat: false, ...}
        let orderSummary =null;
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;
        burger=<Spinner/>
        if(this.state.ingredients){
            burger=(
            <Aux>
            <Burger ingredients={this.state.ingredients} />
            <BuildControls
                ingredientAdded={this.addIngredientHandler}
                ingredientRemoved={this.removeIngredientHandler}
                disabled={disabledInfo}
                purchasable={this.state.purchasable}
                price={this.state.totalPrice}
                finalOrder={this.purschasehandler} />
            </Aux>);
            orderSummary= <OrderSummary 
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}/>
        }

        if(this.state.loading){
            orderSummary=<Spinner/>
        }


        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}</Modal>
            {burger}
                
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);
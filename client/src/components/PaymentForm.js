import React, { useState, useContext } from "react";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from "axios";
import 'bulma/css/bulma.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import "./UserAvatar.css"
import './PaymentForm.css'
import cinima from "../assets/cinima.mp4"
import AuthContext from "../providers/AuthProvider";
import { OrderContext } from "../providers/ContextProvider"

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" }
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
}


export default function PaymentForm({title, price, selectedCinema, selectedDate, selectedTime, ticketAmount, poster, onClose}) {
  const { auth } = useContext(AuthContext);
  const [success, setSuccess] = useState(false)
  const stripe = useStripe()
  const elements = useElements();
  //  const { order, setOrder } = useContext(OrderContext);
  const { allOrders, setAllOrders } = useContext(OrderContext);

  
  // console.log("Moive ticket:", title);
  // console.log("Cinema location:", selectedCinema);
  // console.log("Moive Date:", selectedDate);
  // console.log("Moive Time:", selectedTime);

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement)
    })

    if (!error) {
      try {
        const { id } = paymentMethod
        const response = await axios.post("http://localhost:8080/payment", {
          amount: price*100,
          id
        })
        
        if (response.data.success) {
          console.log("Successful payment", title)
          setSuccess(true)

          const newOrder = {
            title: title,
            selectedCinema: selectedCinema,
            selectedDate: selectedDate,
            selectedTime: selectedTime,
            ticketAmount: ticketAmount,
            poster: poster
          };
          window.localStorage.setItem("title", JSON.stringify(title))
          window.localStorage.setItem("selectedCinema", JSON.stringify(selectedCinema))
          window.localStorage.setItem("selectedDate", JSON.stringify(selectedDate))
          window.localStorage.setItem("selectedTime", JSON.stringify(selectedTime))
          window.localStorage.setItem("ticketAmount", JSON.stringify(ticketAmount))
          window.localStorage.setItem("poster", JSON.stringify(poster))

          console.log("new order", newOrder);
          
          setAllOrders([...allOrders, newOrder]);
          window.localStorage.setItem("allOrders", JSON.stringify(allOrders))
          // console.log("all orders", allOrders);
        }
      } catch (error) {
        console.log('Error==>', error)
      }
    } else {
      console.log(error.message)
    }
  }

  return (
    <>
      {!success ?
        <div className="paymentContainer">
          <video autoPlay loop muted playsInline className="back-video">
            <source src={cinima} type="video/mp4"></source>
          </video>
          <br/>
          <h2>Checkout</h2>
          {/* <h2>Sign in as: {auth.user_email}</h2> */}
          <br/>
          <form onSubmit={handleSubmit} className='paymentForm' style={{paddingTop:"100px"}}>
            <fieldset className="FormGroup">
              <div className="FormRow">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </fieldset>
            <button id ="payButton">Pay</button>
          <h2 style={{fontSize:"20px", fontWeight:"100", paddingTop:"200px"}}>Sign in as: {auth.user_email}</h2>
          </form>
        </div>
        : <div>
        <div className="paymentContainer">
          <div className="paymentDetail">
          <video autoPlay loop muted playsInline className="back-video">
            <source src={cinima} type="video/mp4"></source>
          </video>
            <h2 className="topText">Enjoy your movie!</h2>
          </div>
        </div>
        <div>
            <div className="container ticketContainerAfterPay">
              <div className="item columns is-centered transparent-background">
                <div className="item-right">
                  <img src = {poster}/>
                  <span className="up-border"></span>
                  <span className="down-border"></span>
                </div>
                
                <div className="item-left">
                  <p className="event">Movie</p>
                  <h2 className="title" style={{fontSize:"20px", padding:"0px 0px 0px 0px",  fontWeight:"100"}}>{title}</h2>
                  
                  <div className="sce">
                    <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={solid('calendar-days')} />
                    </span>
                    <p>{selectedDate}</p>
                    <br/> 
                    <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={solid('clock')} />
                    </span>
                    <p>{selectedTime}</p>
                  </div>
                  <div className="loc">
                    <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={solid('location-dot')} />
                    </span>
                    <p>{selectedCinema} </p>
                  </div>
                  <div className="tickets">
                    <p>Tickets X {ticketAmount}</p>
                  </div>
                </div>
              </div>
            <h2 style={{fontSize:"20px", fontWeight:"100", paddingTop:"400px", color:"#FFF"}}>Sign in as: {auth.user_email}</h2>
            </div>
            </div>
          {/* <button className='closeBtn back-home-btn' onClick={()=>{setOpenModal(false); onClose()}}>
            Back to Home
          </button> */}
        </div>
      }
    </>
  )
}
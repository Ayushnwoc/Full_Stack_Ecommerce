import React, {useState} from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Shipping = () => {

    const navigate = useNavigate();

    const [shippingInfo , setShippingInfo] = useState({
        address: "",
        city: "",
        pinCode: "",
        state:"",
        country: "",
    });

    const changeHandler = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    }
	
    return <div className="shipping">
        <button className="back-btn" onClick={()=> navigate("/cart")}>
            <BiArrowBack />
        </button>
        <form >
            <h1>Shipping Address</h1>
            <input type="text" required value={shippingInfo.address} name="address" placeholder="address" onChange={changeHandler}/>
            <input type="text" required value={shippingInfo.city} name="city" placeholder="city" onChange={changeHandler}/>
            <input type="number" required value={shippingInfo.pinCode} name="pinCode" placeholder="pinCode" onChange={changeHandler}/>
            <select required value={shippingInfo.country} name="country" onChange={changeHandler}>
                <option value="">Select Country</option>
                <option value="India">India</option>
            </select>
            <input type="text" required value={shippingInfo.state} name="state" placeholder="state" onChange={changeHandler}/>
            <button type="submit">Pay Now</button>
        </form>
    </div>;
};

export default Shipping;

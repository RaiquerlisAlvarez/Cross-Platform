import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import xau from './assets/xau.jpg';
import btc from './assets/btc.jpg';

function App() {

  const [btnShow, setBtnShow] = useState({
    xau_buy : false,
    xau_sell : false,
    xau_close : false,
    btc_buy : false,
    btc_sell : false,
    btc_close : false,
  });

  const [flag, setFlag] = useState(true);

  const [data, setData] = useState({
    xau_times_buy: 0,
    xau_tp1_buy: 0,
    xau_increment_buy: 0,
    xau_price_buy: 2649,
    market_increment_xau : 0,
    market_next_xau : 0,
    market_price_xau : 0,
    btc_times_buy: 0,
    btc_tp1_buy: 0,
    btc_increment_buy: 0,
    btc_price_buy: 2076,
    market_increment_btc : 0,
    market_next_btc : 0,
    market_price_btc : 0,
  });

  
  // const getXauPrice = async() => {
  //   try {
  //     const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
  //     let ice = 0;
  //     for(let item in response.data){
  //       ice = response.data[item];
  //     }
  //     console.log(ice);
  //     setData(() => (
  //       {...data, 
  //         xau_price_buy : ice.usd
  //       }
  //     ));
  //   } catch (err) {
  //     setData(() => (
  //       {...data, 
  //         xau_price_buy : 0
  //       }
  //     ));
  //   }
  // }
  const getBtcPrice = async() => {
    try {
    await axios.get('/getprice')
      .then(res => {
        setData(() => (
          {...data, 
            btc_price_buy : res.data.price
          }
        ));
      })
      .catch(() => console.log("error"));

    } catch (err) {
      setData(() => (
        {...data, 
          btc_price_buy : 0
        }
      ));
    }
  }

  const botToken = "7095733969:AAH5g4nmGfJwyrCfEvurKdHIlKBqvxPBx7o";
  const chatId = "-4549357244";

  useEffect(() => {

    const fetchGoldPrice = async () => {
      try {
        let ice = 0, ice1 = 0;
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
        await axios.get('/getprice')
        .then(res => {
          ice1 = res.data.price;
          console.log(typeof(res.data.price) + "  " + res.data.price);
        })

        Object.values(response.data).forEach(item => {
          console.log(item);
          console.log(typeof(item['usd']) + "  " + item['usd']);
          ice = item['usd'];
        });
        setData(prev => ({...prev,btc_price_buy : ice1, market_price_btc : ice1, xau_price_buy : ice, market_price_xau : ice}));

      } catch (err) {
        console.log('error');
      }
    };
    if(flag){
      fetchGoldPrice();
      setFlag(false);
    }
  });

  const [errors, setErrors] = useState({
    xau_buy_times : "",
    xau_buy_tp1 : "",
    xau_buy_increment : "",
    market_increment_xau : "",
    market_next_xau : "",
    market_price_xau : "",
    btc_buy_times : "",
    btc_buy_tp1 : "",
    btc_buy_increment : "",
    market_increment_btc : "",
    market_next_btc : "",
    market_price_btc : "",
  });

  const [store, setStore] = useState({
    xau_buy : "",
    xau_sell : "",
    btc_buy : "",
    btc_sell : "",
  })

  const errorDisplay = async(sent, type) => {
    switch(sent){
      case "XAU_BUY_CLOSE":
        if(store.xau_buy === ""){
          toast.error(
            "The XAU Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
          
        }
        try {
          await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: type,
                reply_to_message_id: store.xau_buy,
              },
            }
          );
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        setStore(prev => ({...prev, xau_buy : ""}));
        break;
      case "XAU_SELL_CLOSE":
        if(store.xau_sell === ""){
          toast.error(
            "The XAU SELL Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
        }
        try {
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: type,
                reply_to_message_id: store.xau_sell,
              },
            }
          );
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        setStore(prev => ({...prev, xau_sell : ""}));
        break;

      case "BTC_BUY_CLOSE":
        if(store.btc_buy === ""){
          toast.error(
            "The btc Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
          
        }
        try {
          await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: type,
                reply_to_message_id: store.btc_buy,
              },
            }
          );
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        setStore(prev => ({...prev, btc_buy : ""}));
        break;
      case "BTC_SELL_CLOSE":
        if(store.btc_sell === ""){
          toast.error(
            "The BTC SELL Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
        }
        try {
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: type,
                reply_to_message_id: store.btc_sell,
              },
            }
          );
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        setStore(prev => ({...prev, btc_sell : ""}));
        break;

    default:
      break;  
    }
  }

  const BuyOrSell = async (sent, times, tp1, increment, price, market_price, market_increment) => {


    let num_price = parseInt(price);
    let num_tp1 = parseInt(tp1);
    let num_times = parseInt(times);
    let num_increment = parseInt(increment);
    let num_market_price = parseInt(market_price);
    let num_market_increment = parseInt(market_increment);
    let tokenMessage = "";

    switch (sent) {
      case 'XAU_BUY':
        tokenMessage = "BUY XAUUSD "+ num_price + "\n";
        try {
          let i = 0, num = num_price;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num += num_tp1;
            }
            else{
              num += num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}.\n`;
          }
          setData(prev => ({...prev, xau_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, xau_buy : response.data.result.message_id, xau_sell : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;

      case 'XAU_BUY_MARKET':
        tokenMessage = "BUY MARKET XAUUSD "+ num_market_price + "\n";
        try {
          let i = 0, num = num_market_price + num_market_increment;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num += num_tp1;
            }
            else{
              num += num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}.\n`;
          }
          setData(prev => ({...prev, xau_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, xau_buy : response.data.result.message_id, xau_sell : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;

      case 'XAU_SELL':
        tokenMessage = "SELL XAUUSD "+ num_price + "\n";
        try {
          let i = 0, num = num_price;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num -= num_tp1;
            }
            else{
              num -= num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}. \n`;
          }
          setData(prev => ({...prev, xau_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, xau_sell : response.data.result.message_id, xau_buy : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;
      
      case 'XAU_SELL_MARKET':
        tokenMessage = "SELL MARKET XAUUSD "+ num_market_price + "\n";
        try {
          let i = 0, num = num_market_price - num_market_increment;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num -= num_tp1;
            }
            else{
              num -= num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}. \n`;
          }
          setData(prev => ({...prev, xau_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, xau_sell : response.data.result.message_id, xau_buy : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;
        
      case 'BTC_BUY':
        tokenMessage = "BUY BTCUSD "+ num_price + "\n";
        try {
          let i = 0, num = num_price;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num += num_tp1;
            }
            else{
              num += num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}.\n`;
          }
          setData(prev => ({...prev, btc_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, btc_buy : response.data.result.message_id, btc_sell : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;

      case 'BTC_BUY_MARKET':
        tokenMessage = "BUY MARKET BTCUSD "+ num_market_price + "\n";
        try {
          let i = 0, num = num_market_price + num_market_increment;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num += num_tp1;
            }
            else{
              num += num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}.\n`;
          }
          setData(prev => ({...prev, btc_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, btc_buy : response.data.result.message_id, btc_sell : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;

      case 'BTC_SELL':
        tokenMessage = "SELL BTCUSD "+ num_price + "\n";
        try {
          let i = 0, num = num_price;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num -= num_tp1;
            }
            else{
              num -= num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}. \n`;
          }
          setData(prev => ({...prev, btc_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, btc_sell : response.data.result.message_id, btc_buy : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;
      
      case 'BTC_SELL_MARKET':
        tokenMessage = "SELL MARKET BTCUSD "+ num_market_price + "\n";
        try {
          let i = 0, num = num_market_price - num_market_increment;
          for(i = 0; i < num_times; i++){
            if(i === 0){
              num -= num_tp1;
            }
            else{
              num -= num_increment;
            }
            tokenMessage += `TP${ i + 1 }:  ${num}. \n`;
          }
          setData(prev => ({...prev, btc_price_buy : num}));
          const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
              params: {
                chat_id: chatId,
                text: tokenMessage,
                parse_mode: "HTML",
              },
            }
          );
          setStore(prev => ({...prev, btc_sell : response.data.result.message_id, btc_buy : ''}));
        } catch (error) {
          console.error("Error sending message to Telegram:", error);
        }
        break;
        
      default:
      break;

    }
  }
  const handleService = async (sent) => {

    switch (sent) {
      case 'XAU_BUY':
        if (data.xau_times_buy && data.xau_tp1_buy && data.xau_increment_buy && data.xau_price_buy) {
          BuyOrSell("XAU_BUY", data.xau_times_buy, data.xau_tp1_buy, data.xau_increment_buy, data.xau_price_buy, 0, 0);
          setErrors(errors => ({ ...errors, xau_buy_times: "" }));
          setErrors(errors => ({ ...errors, xau_buy_tp1: "" }));
          setErrors(errors => ({ ...errors, xau_buy_increment: "" }));
        } else {
          let temp_error = "";

          if(data.xau_times_buy === 0){
            temp_error += "Type the XAU repeat times correctly";
            setErrors(errors => ({ ...errors, xau_buy_times: "invalid-input" }));
          }
          else if(data.xau_tp1_buy === 0){
            temp_error += "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, xau_buy_times: "" }));
            setErrors(errors => ({ ...errors, xau_buy_tp1: "invalid-input" }));
          }
          else if(data.xau_increment_buy === 0){
            temp_error += "Type the increment correctly";
            setErrors(errors => ({ ...errors, xau_buy_tp1: "" }));
            setErrors(errors => ({ ...errors, xau_buy_increment: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'XAU_BUY_MARKET':
        if (data.xau_times_buy && data.xau_tp1_buy && data.xau_increment_buy && data.xau_price_buy && data.market_price_xau && data.market_increment_xau) {
          BuyOrSell("XAU_BUY_MARKET", data.xau_times_buy, data.xau_tp1_buy, data.xau_increment_buy, data.xau_price_buy,data.market_price_xau, data.market_increment_xau);
          setErrors({});
        } else {
          let temp_error = "";

          if(data.xau_times_buy === 0){
            temp_error = "Type the XAU repeat times correctly";
            setErrors(errors => ({ ...errors, xau_buy_times: "invalid-input" }));
          }
          else if(data.xau_tp1_buy === 0){
            temp_error = "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, xau_buy_times: "",  xau_buy_tp1: "invalid-input" }));
          }
          else if(data.xau_increment_buy === 0){
            temp_error = "Type the increment correctly";
            setErrors(errors => ({ ...errors, xau_buy_tp1: "" , xau_buy_increment: "invalid-input" }));
          }
          else if(data.market_increment_xau === 0){
            temp_error = "Type the Market Increment correctly";
            setErrors(errors => ({ ...errors, xau_buy_increment: "" , market_increment_xau: "invalid-input" }));
          }
          else if(data.market_price_xau === 0){
            console.log(data.market_price_xau);
            temp_error = "Type the Market Price correctly";
            setErrors(errors => ({ ...errors, market_increment_xau: "" , market_price_xau: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'XAU_CLOSE_HALF':
        if(store.xau_buy === "" && store.xau_sell === ""){
          toast.error(
            "The XAU Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
        }
        else if(store.xau_buy === ""){
          errorDisplay("XAU_SELL_CLOSE", "HC");
        }
        else{
          errorDisplay("XAU_BUY_CLOSE", "HC");
        }
        break;
      case 'XAU_CLOSE_TOTAL':
        if(store.xau_buy === "" && store.xau_sell === ""){
          toast.error(
            "The XAU Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;          
        }
        else if(store.xau_buy === ""){
          errorDisplay("XAU_SELL_CLOSE", "FC");
        }
        else{
          errorDisplay("XAU_BUY_CLOSE", "FC");
        }
        break;
      case 'XAU_CLOSE_DELETE':
        if(store.xau_buy === "" && store.xau_sell === ""){
          toast.error(
            "The XAU Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;          
        }
        else if(store.xau_buy === ""){
          errorDisplay("XAU_SELL_CLOSE", "DEL");
        }
        else{
          errorDisplay("XAU_BUY_CLOSE", "DEL");
        }
        break;
      case 'XAU_SELL':
        if (data.xau_times_buy && data.xau_tp1_buy && data.xau_increment_buy && data.xau_price_buy) {
          BuyOrSell("XAU_SELL", data.xau_times_buy, data.xau_tp1_buy, data.xau_increment_buy, data.xau_price_buy, 0, 0);
          setErrors(errors => ({ ...errors, xau_sell_times: "" }));
          setErrors(errors => ({ ...errors, xau_sell_tp1: "" }));
          setErrors(errors => ({ ...errors, xau_sell_increment: "" }));
        } else {
          let temp_error = "";

          if(data.xau_times_buy === 0){
            temp_error += "Type the XAU repeat times correctly";
            setErrors(errors => ({ ...errors, xau_sell_times: "invalid-input" }));
          }
          else if(data.xau_tp1_buy === 0){
            temp_error += "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, xau_sell_times: "" }));
            setErrors(errors => ({ ...errors, xau_sell_tp1: "invalid-input" }));
          }
          else if(data.xau_increment_buy === 0){
            temp_error += "Type the increment correctly";
            setErrors(errors => ({ ...errors, xau_sell_tp1: "" }));
            setErrors(errors => ({ ...errors, xau_sell_increment: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'XAU_SELL_MARKET':
        if (data.xau_times_buy && data.xau_tp1_buy && data.xau_increment_buy && data.xau_price_buy && data.market_price_xau && data.market_increment_xau) {
          BuyOrSell("XAU_SELL_MARKET", data.xau_times_buy, data.xau_tp1_buy, data.xau_increment_buy, data.xau_price_buy, data.market_price_xau, data.market_increment_xau);
          setErrors({});
        } else {
          let temp_error = "";

          if(data.xau_times_buy === 0){
            temp_error += "Type the XAU repeat times correctly";
            setErrors(errors => ({ ...errors, xau_sell_times: "invalid-input" }));
          }
          else if(data.xau_tp1_buy === 0){
            temp_error += "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, xau_sell_times: "" }));
            setErrors(errors => ({ ...errors, xau_sell_tp1: "invalid-input" }));
          }
          else if(data.xau_increment_buy === 0){
            temp_error += "Type the increment correctly";
            setErrors(errors => ({ ...errors, xau_sell_tp1: "" }));
            setErrors(errors => ({ ...errors, xau_sell_increment: "invalid-input" }));
          }
          else if(data.market_increment_xau === 0){
            temp_error += "Type the market increment correctly";
            setErrors(errors => ({ ...errors, xau_sell_increment: "" }));
            setErrors(errors => ({ ...errors, market_increment_xau: "invalid-input" }));
          }
          else if(data.market_price_xau === 0){
            temp_error += "Type the market price correctly";
            setErrors(errors => ({ ...errors, market_increment_xau: "" }));
            setErrors(errors => ({ ...errors, market_price_xau: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'XAU_SELL_CLOSE':
        BuyOrSell("XAU_SELL_CLOSE", 0, 0, 0, 0);
        break;
      case 'XAU_NEXT':
        if(store.xau_buy == 0 && store.xau_sell == 0){
          toast.error(
            "To get the next Data, you need to buy or sell first", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
        }
        else if(data.market_next_xau == 0){
          toast.error(
            "The Next Data is 0", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;

        }
        else  if(store.xau_sell == 0){
          BuyOrSell("XAU_BUY", data.xau_times_buy, data.xau_tp1_buy, data.xau_increment_buy, (parseInt(data.xau_price_buy) + parseInt(data.market_next_xau)) ,data.market_price_xau, data.market_increment_xau);
        }
        else{
          BuyOrSell("XAU_SELL", data.xau_times_buy, data.xau_tp1_buy, data.xau_increment_buy, (parseInt(data.xau_price_buy) - parseInt(data.market_next_xau)) ,data.market_price_xau, data.market_increment_xau);
        }
        break;
      case 'BTC_BUY':
        if (data.btc_times_buy && data.btc_tp1_buy && data.btc_increment_buy && data.btc_price_buy) {
          BuyOrSell("BTC_BUY", data.btc_times_buy, data.btc_tp1_buy, data.btc_increment_buy, data.btc_price_buy, 0, 0);
          setErrors(errors => ({ ...errors, btc_buy_times: "" }));
          setErrors(errors => ({ ...errors, btc_buy_tp1: "" }));
          setErrors(errors => ({ ...errors, btc_buy_increment: "" }));
        } else {
          let temp_error = "";

          if(data.btc_times_buy === 0){
            temp_error += "Type the BTC repeat times correctly";
            setErrors(errors => ({ ...errors, btc_buy_times: "invalid-input" }));
          }
          else if(data.btc_tp1_buy === 0){
            temp_error += "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, btc_buy_times: "" }));
            setErrors(errors => ({ ...errors, btc_buy_tp1: "invalid-input" }));
          }
          else if(data.btc_increment_buy === 0){
            temp_error += "Type the increment correctly";
            setErrors(errors => ({ ...errors, btc_buy_tp1: "" }));
            setErrors(errors => ({ ...errors, btc_buy_increment: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'BTC_BUY_MARKET':
        if (data.btc_times_buy && data.btc_tp1_buy && data.btc_increment_buy && data.btc_price_buy && data.market_price_btc && data.market_increment_btc) {
          BuyOrSell("BTC_BUY_MARKET", data.btc_times_buy, data.btc_tp1_buy, data.btc_increment_buy, data.btc_price_buy,data.market_price_btc, data.market_increment_btc);
          setErrors({});
        } else {
          let temp_error = "";

          if(data.btc_times_buy === 0){
            temp_error = "Type the BTC repeat times correctly";
            setErrors(errors => ({ ...errors, btc_buy_times: "invalid-input" }));
          }
          else if(data.btc_tp1_buy === 0){
            temp_error = "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, btc_buy_times: "",  btc_buy_tp1: "invalid-input" }));
          }
          else if(data.btc_increment_buy === 0){
            temp_error = "Type the increment correctly";
            setErrors(errors => ({ ...errors, btc_buy_tp1: "" , btc_buy_increment: "invalid-input" }));
          }
          else if(data.market_increment_btc === 0){
            temp_error = "Type the Market Increment correctly";
            setErrors(errors => ({ ...errors, btc_buy_increment: "" , market_increment_btc: "invalid-input" }));
          }
          else if(data.market_price_btc === 0){
            console.log(data.market_price_btc);
            temp_error = "Type the Market Price correctly";
            setErrors(errors => ({ ...errors, market_increment_btc: "" , market_price_btc: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'BTC_CLOSE_HALF':
        if(store.btc_buy === "" && store.btc_sell === ""){
          toast.error(
            "The BTC Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
        }
        else if(store.btc_buy === ""){
          errorDisplay("BTC_SELL_CLOSE", "HC");
        }
        else{
          errorDisplay("BTC_BUY_CLOSE", "HC");
        }
        break;
      case 'BTC_CLOSE_TOTAL':
        if(store.btc_buy === "" && store.btc_sell === ""){
          toast.error(
            "The btc Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;          
        }
        else if(store.btc_buy === ""){
          errorDisplay("BTC_SELL_CLOSE", "FC");
        }
        else{
          errorDisplay("BTC_BUY_CLOSE", "FC");
        }
        break;
      case 'BTC_CLOSE_DELETE':
        if(store.btc_buy === "" && store.btc_sell === ""){
          toast.error(
            "The BTC Data has already deleted", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;          
        }
        else if(store.btc_buy === ""){
          errorDisplay("BTC_SELL_CLOSE", "DEL");
        }
        else{
          errorDisplay("BTC_BUY_CLOSE", "DEL");
        }
        break;
      case 'BTC_SELL':
        if (data.btc_times_buy && data.btc_tp1_buy && data.btc_increment_buy && data.btc_price_buy) {
          BuyOrSell("BTC_SELL", data.btc_times_buy, data.btc_tp1_buy, data.btc_increment_buy, data.btc_price_buy, 0, 0);
          setErrors(errors => ({ ...errors, btc_sell_times: "" }));
          setErrors(errors => ({ ...errors, btc_sell_tp1: "" }));
          setErrors(errors => ({ ...errors, btc_sell_increment: "" }));
        } else {
          let temp_error = "";

          if(data.btc_times_buy === 0){
            temp_error += "Type the BTC repeat times correctly";
            setErrors(errors => ({ ...errors, btc_sell_times: "invalid-input" }));
          }
          else if(data.btc_tp1_buy === 0){
            temp_error += "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, btc_sell_times: "" }));
            setErrors(errors => ({ ...errors, btc_sell_tp1: "invalid-input" }));
          }
          else if(data.btc_increment_buy === 0){
            temp_error += "Type the increment correctly";
            setErrors(errors => ({ ...errors, btc_sell_tp1: "" }));
            setErrors(errors => ({ ...errors, btc_sell_increment: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'BTC_SELL_MARKET':
        if (data.btc_times_buy && data.btc_tp1_buy && data.btc_increment_buy && data.btc_price_buy && data.market_price_btc && data.market_increment_btc) {
          BuyOrSell("BTC_SELL_MARKET", data.btc_times_buy, data.btc_tp1_buy, data.btc_increment_buy, data.btc_price_buy, data.market_price_btc, data.market_increment_btc);
          setErrors({});
        } else {
          let temp_error = "";

          if(data.btc_times_buy === 0){
            temp_error += "Type the btc repeat times correctly";
            setErrors(errors => ({ ...errors, btc_sell_times: "invalid-input" }));
          }
          else if(data.btc_tp1_buy === 0){
            temp_error += "Type the TP1 correctly";
            setErrors(errors => ({ ...errors, btc_sell_times: "" }));
            setErrors(errors => ({ ...errors, btc_sell_tp1: "invalid-input" }));
          }
          else if(data.btc_increment_buy === 0){
            temp_error += "Type the increment correctly";
            setErrors(errors => ({ ...errors, btc_sell_tp1: "" }));
            setErrors(errors => ({ ...errors, btc_sell_increment: "invalid-input" }));
          }
          else if(data.market_increment_btc === 0){
            temp_error += "Type the market increment correctly";
            setErrors(errors => ({ ...errors, btc_sell_increment: "" }));
            setErrors(errors => ({ ...errors, market_increment_btc: "invalid-input" }));
          }
          else if(data.market_price_btc === 0){
            temp_error += "Type the market price correctly";
            setErrors(errors => ({ ...errors, market_increment_btc: "" }));
            setErrors(errors => ({ ...errors, market_price_btc: "invalid-input" }));
          }

          toast.error(
            temp_error, {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        break;
      case 'BTC_SELL_CLOSE':
        BuyOrSell("BTC_SELL_CLOSE", 0, 0, 0, 0);
        break;
      case 'BTC_NEXT':
        if(store.btc_buy == 0 && store.btc_sell == 0){
          toast.error(
            "To get the next Data, you need to buy or sell first", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;
        }
        else if(data.market_next_btc == 0){
          toast.error(
            "The Next Data is 0", {
            Position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,

          });
          return;

        }
        else  if(store.btc_sell == 0){
          BuyOrSell("BTC_BUY", data.btc_times_buy, data.btc_tp1_buy, data.btc_increment_buy, (parseInt(data.btc_price_buy) + parseInt(data.market_next_btc)) ,data.market_price_btc, data.market_increment_btc);
        }
        else{
          BuyOrSell("BTC_SELL", data.btc_times_buy, data.btc_tp1_buy, data.btc_increment_buy, (parseInt(data.btc_price_buy) - parseInt(data.market_next_btc)) ,data.market_price_btc, data.market_increment_btc);
        }
        break;
      default:
      break;

    }

  }

  return (
    <div className="App">
      <div className='back-blue'></div>
      <ToastContainer />
      <div className="mt-50">
        <div className='app-title'>
          <h1 className='text-center f-white title-h1 gradient-text'>CROSS FLATFORM</h1>
        </div>
      </div>
      <form className="app-body mt-50 justify-between col-md-10 col-md-offset-1">
        <div className='app-xau flex-wrap flex-row align-center justify-between'>
          <div className="app-body-left col-6-group">
            <div className='app-left-title'>
              <h1 className='text-center mb-50 f-white'>XAUUSD </h1>
            </div>
            <div className='col-12 flex-row flex-wrap xau-input-container'>
              <div className='col-4 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="xau_times_buy">Times</label>
                </div>
                <div className='xau-input-content'>
                  <input type="number" id='xau_times_buy' name='xau_times_buy' onChange={(e) => {
                      let temp = data;
                      temp.xau_times_buy = e.target.value;
                      setData(temp);
                    }} placeholder="Times" min='3' max='5' className={'input-text form-control ' + errors.xau_buy_times} />
                </div>
              </div>
              <div className='col-4 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="xau_tp1_buy">TP1</label>
                </div>
                <div className='xau-input-content'>
                    <input type="number" id='xau_tp1_buy' name='xau_tp1_buy' onChange={(e) => {
                      setData((prev) => ({...prev, xau_tp1_buy : e.target.value}));
                    }} placeholder="TP1" min='1' max='100' className={'input-text form-control ' + errors.xau_buy_tp1} />
                </div>
              </div>
              <div className='col-4 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="xau_increment_buy">Increment</label>
                </div>
                <div className='xau-input-content'>
                    <input type="number" name='xau_increment_buy' id='xau_increment_buy' onChange={(e) => {
                      let temp = data;
                      temp.xau_increment_buy = e.target.value;
                      setData(prev => ({...prev, xau_increment_buy : e.target.value}));
                    }} placeholder="Increment" min='1' max='100' className={'input-text form-control ' + errors.xau_buy_increment} />
                </div>
              </div>
              <div className='col-4 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="market_next_xau">Next</label>
                </div>
                <div className='xau-input-content'>
                  <input type="number" id='market_next_xau' name='market_next_xau' onChange={(e) => {
                    let temp = data;
                    temp.market_next_xau = e.target.value;
                    setData(prev => ({...prev, market_next_xau : e.target.value}));
                  }} placeholder="Market Next" min='0' className={'input-text form-control ' + errors.market_next_xau} />
                </div>
              </div>
              <div className='col-4 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="market_price_xau">Market Price</label>
                </div>
                <div className='xau-input-content'>
                    <input type="number" id='market_price_xau' name='market_price_xau' 
                       readOnly value={data.market_price_xau} placeholder="Market Price" 
                       className={'input-text form-control ' + errors.market_price_xau} />
                </div>
              </div>
              <div className='col-4 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="market_increment_xau">Market Increment</label>
                </div>
                <div className='xau-input-content'>
                    <input type="number" id='market_increment_xau' name='market_increment_xau' onChange={(e) => {
                      setData((prev) => ({...prev, market_increment_xau : e.target.value}));
                    }}  placeholder="Price" min='1' max='100' className='input-text form-control' />
                </div>
              </div>
            </div>
            <div className='col-12 flex-row flex-wrap xau-btn-container'>
              <div className='col-3 xau-btn-group'>
                <div className='xau-btn-main'>
                  <span className='btn btn-success' 
                    onClick={() => {
                      setBtnShow(prev => ({xau_buy : !(btnShow.xau_buy)}));
                    }}>BUY</span>
                  {
                    btnShow.xau_buy &&
                      <div className='xau-btn-hover'>
                        <div className='position-relative flex-row'>
                          <span className='btn btn-success btn-left' onClick={() => handleService('XAU_BUY')}>Normal</span>
                          <span className='btn btn-success btn-right' onClick={() => handleService('XAU_BUY_MARKET')}>Market</span>
                        </div>
                      </div>
                  }
                </div>
              </div>
              <div className='col-3 xau-btn-group'>
                <div className='xau-btn-main'>
                  <span className='btn btn-info' 
                    onClick={() => {
                      setBtnShow(prev => ({xau_sell : !(btnShow.xau_sell)}));
                    }}>SELL</span>
                  {
                    btnShow.xau_sell &&
                      <div className='xau-btn-hover'>
                        <div className='position-relative flex-row'>
                          <span className='btn btn-info btn-left' onClick={() => handleService('XAU_SELL')}>Normal</span>
                          <span className='btn btn-info btn-right' onClick={() => handleService('XAU_SELL_MARKET')}>Market</span>
                        </div>
                      </div>
                  }
                </div>
              </div>
              <div className='col-3 xau-btn-group'>
                <div className='xau-btn-main'>
                  <span className='btn btn-danger' 
                    onClick={() => {
                      setBtnShow(prev => ({xau_close : !(btnShow.xau_close)}));
                    }}>CLOSE</span>
                  {
                    btnShow.xau_close &&
                      <div className='xau-btn-hover'>
                        <div className='position-relative flex-row'>
                          <span className='btn btn-danger btn-left' onClick={() => handleService('XAU_CLOSE_HALF')}>HALF</span>
                          <span className='btn btn-danger btn-center' onClick={() => handleService('XAU_CLOSE_TOTAL')}>TOTAL</span>
                          <span className='btn btn-danger btn-right' onClick={() => handleService('XAU_CLOSE_DELETE')}>DELETE</span>
                        </div>
                      </div>
                  }
                </div>
              </div>
              <div className='col-3 xau-btn-group'>
                <div className='xau-btn-main'>
                  <span className='btn btn-success' onClick={() => handleService('XAU_NEXT')}>NEXT</span>
                </div>
              </div>
            </div>
            <div className='col-12 flex-row justify-center'>
              <div className='col-6 xau-input-group'>
                <div className='xau-input-title'>
                  <label htmlFor="xau_price_buy">PRICE</label>
                </div>
                <div className='xau-input-content'>
                    <input type="number" id='xau_price_buy' name='xau_price_buy' onChange={(e) => {
                      setData((prev) => ({...prev, xau_price_buy : e.target.value}));
                    }} value={data.xau_price_buy} className='input-text text-center form-control' />
                </div>
              </div>
            </div>

          </div>
          <div className='app-xau-img col-6-group'>
            <img src={xau} alt='xau' className='col-12'/>
          </div>
        </div>
        <div className='app-btc mt-50 flex-wrap flex-row align-center justify-between'>
          <div className='app-btc-img col-6-group'>
            <img src={btc} alt='btc' className='col-12'/>
          </div>
          <div className='app-body-right col-6-group'>
            <div className='app-left-title'>
              <h1 className='text-center mb-50 f-white'>BTCUSD</h1>
            </div>
            <div className='col-12 flex-row flex-wrap btc-input-container'>
              <div className='col-4 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="btc_times_buy">Times</label>
                </div>
                <div className='btc-input-content'>
                  <input type="number" id='btc_times_buy' name='btc_times_buy' onChange={(e) => {
                      let temp = data;
                      temp.btc_times_buy = e.target.value;
                      setData(temp);
                    }} placeholder="Times" min='3' max='5' className={'input-text form-control ' + errors.btc_buy_times} />
                </div>
              </div>
              <div className='col-4 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="btc_tp1_buy">TP1</label>
                </div>
                <div className='btc-input-content'>
                    <input type="number" id='btc_tp1_buy' name='btc_tp1_buy' onChange={(e) => {
                      setData((prev) => ({...prev, btc_tp1_buy : e.target.value}));
                    }} placeholder="TP1" min='1' max='100' className={'input-text form-control ' + errors.btc_buy_tp1} />
                </div>
              </div>
              <div className='col-4 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="btc_increment_buy">Increment</label>
                </div>
                <div className='btc-input-content'>
                    <input type="number" name='btc_increment_buy' id='btc_increment_buy' onChange={(e) => {
                      let temp = data;
                      temp.btc_increment_buy = e.target.value;
                      setData(prev => ({...prev, btc_increment_buy : e.target.value}));
                    }} placeholder="Increment" min='1' max='100' className={'input-text form-control ' + errors.btc_buy_increment} />
                </div>
              </div>
              <div className='col-4 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="market_next_btc">Next</label>
                </div>
                <div className='btc-input-content'>
                  <input type="number" id='market_next_btc' name='market_next_btc' onChange={(e) => {
                    let temp = data;
                    temp.market_next_btc = e.target.value;
                    setData(prev => ({...prev, market_next_btc : e.target.value}));
                  }} placeholder="Market Next" min='0' className={'input-text form-control ' + errors.market_next_btc} />
                </div>
              </div>
              <div className='col-4 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="market_price_btc">Market Price</label>
                </div>
                <div className='btc-input-content'>
                    <input type="number" id='market_price_btc' name='market_price_btc' 
                       readOnly value={data.market_price_btc} placeholder="Market Price" 
                       className={'input-text form-control ' + errors.market_price_btc} />
                </div>
              </div>
              <div className='col-4 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="market_increment_btc">Market Increment</label>
                </div>
                <div className='btc-input-content'>
                    <input type="number" id='market_increment_btc' name='market_increment_btc' onChange={(e) => {
                      setData((prev) => ({...prev, market_increment_btc : e.target.value}));
                    }}  placeholder="Price" min='1' max='100' className='input-text form-control' />
                </div>
              </div>
            </div>
            <div className='col-12 flex-row flex-wrap btc-btn-container'>
              <div className='col-3 btc-btn-group'>
                <div className='btc-btn-main'>
                  <span className='btn btn-success' 
                    onClick={() => {
                      setBtnShow(prev => ({btc_buy : !(btnShow.btc_buy)}));
                    }}>BUY</span>
                  {
                    btnShow.btc_buy &&
                      <div className='btc-btn-hover'>
                        <div className='position-relative flex-row'>
                          <span className='btn btn-success btn-left' onClick={() => handleService('BTC_BUY')}>Normal</span>
                          <span className='btn btn-success btn-right' onClick={() => handleService('BTC_BUY_MARKET')}>Market</span>
                        </div>
                      </div>
                  }
                </div>
              </div>
              <div className='col-3 btc-btn-group'>
                <div className='btc-btn-main'>
                  <span className='btn btn-info' 
                    onClick={() => {
                      setBtnShow(prev => ({btc_sell : !(btnShow.btc_sell)}));
                    }}>SELL</span>
                  {
                    btnShow.btc_sell &&
                      <div className='btc-btn-hover'>
                        <div className='position-relative flex-row'>
                          <span className='btn btn-info btn-left' onClick={() => handleService('BTC_SELL')}>Normal</span>
                          <span className='btn btn-info btn-right' onClick={() => handleService('BTC_SELL_MARKET')}>Market</span>
                        </div>
                      </div>
                  }
                </div>
              </div>
              <div className='col-3 btc-btn-group'>
                <div className='btc-btn-main'>
                  <span className='btn btn-danger' 
                    onClick={() => {
                      setBtnShow(prev => ({btc_close : !(btnShow.btc_close)}));
                    }}>CLOSE</span>
                  {
                    btnShow.btc_close &&
                      <div className='btc-btn-hover'>
                        <div className='position-relative flex-row'>
                          <span className='btn btn-danger btn-left' onClick={() => handleService('BTC_CLOSE_HALF')}>HALF</span>
                          <span className='btn btn-danger btn-center' onClick={() => handleService('BTC_CLOSE_TOTAL')}>TOTAL</span>
                          <span className='btn btn-danger btn-right' onClick={() => handleService('BTC_CLOSE_DELETE')}>DELETE</span>
                        </div>
                      </div>
                  }
                </div>
              </div>
              <div className='col-3 btc-btn-group'>
                <div className='btc-btn-main'>
                  <span className='btn btn-success' onClick={() => handleService('BTC_NEXT')}>NEXT</span>
                </div>
              </div>
            </div>
            <div className='col-12 flex-row justify-center'>
              <div className='col-6 btc-input-group'>
                <div className='btc-input-title'>
                  <label htmlFor="btc_price_buy">PRICE</label>
                </div>
                <div className='btc-input-content'>
                    <input type="number" id='btc_price_buy' name='btc_price_buy' onChange={(e) => {
                      setData((prev) => ({...prev, btc_price_buy : e.target.value}));
                    }} value={data.btc_price_buy} className='input-text text-center form-control' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default App;


// 7831050930:AAHz1Wq8td2BGEuLPf4iFglin0SwhBo5PgY
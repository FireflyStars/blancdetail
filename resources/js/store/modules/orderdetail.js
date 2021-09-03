import {
    ORDERDETAIL_SET_LOADER,
    ORDERDETAIL_LOAD_DETAIL,
    ORDERDETAIL_GET_LOADER,
    ORDERDETAIL_SET_DETAILS,
    ORDERDETAIL_GET_DETAILS,
    ORDERDETAIL_MULTI_ITEMS_CHECKED,
    ORDERDETAIL_MULTI_ITEMS_ADD,
    ORDERDETAIL_MULTI_ITEMS_UNCHECKED,
    ORDERDETAIL_MULTI_ITEMS_REMOVE,
    ORDERDETAIL_GET_ALL_ITEMS_MULITCHECKED,
    ORDERLIST_UPDATE_STATUS,
    ORDERDETAIL_UPDATE_STATUS,
    ORDERDETAIL_UPDATE_SUGGESTED_DELIVERY_DATE, ORDERDETAIL_SET_SUGGESTED_DELIVERY_DATE,

} from "../types/types";
import axios from "axios";


export const orderdetail= {
    namespaced:true,

    state:{
        loader:'',
        orderdetail:{

        },
        selected_items:{

        }
    },
    mutations: {
        [ORDERDETAIL_SET_LOADER]: (state, payload) => state.loader = payload,
        [ORDERDETAIL_SET_DETAILS]: (state,payload) =>state.orderdetail=payload,
        [ORDERDETAIL_MULTI_ITEMS_ADD]:(state, payload)=>{
            if(typeof state.selected_items[payload.suborder]==="undefined")
                state.selected_items[payload.suborder]=[];
            if(state.selected_items[payload.suborder].includes(payload.infoitems_id)===false)
            state.selected_items[payload.suborder].push(payload.infoitems_id);
        },
        [ORDERDETAIL_MULTI_ITEMS_REMOVE]:(state, payload)=>{

            state.selected_items[payload.suborder]=state.selected_items[payload.suborder].filter(item=>item!==payload.infoitems_id);
            if(state.selected_items[payload.suborder].length==0){
                delete state.selected_items[payload.suborder];
            }
        },
        [ORDERDETAIL_UPDATE_STATUS]:(state,payload)=> state.orderdetail.detail.Status=payload,

        [ORDERDETAIL_SET_SUGGESTED_DELIVERY_DATE]:(state,payload)=>state.orderdetail.detail.suggestedDeliveryDate=payload,
    }
    ,
    actions:{
        [ORDERDETAIL_LOAD_DETAIL]:async ({commit},infoOrder_id)=>{
            commit(ORDERDETAIL_SET_LOADER,'animate40');


            return axios.post('/getorderdetail', {
                infoOrder_id:infoOrder_id

            }).then( (response)=>{
                if(response.data.order.detail!=null){

                        commit(ORDERDETAIL_SET_DETAILS,response.data.order);



                }
                return Promise.resolve(response);
            })
                .catch((error)=>{
                    return Promise.reject(error);
                }).finally(()=>{
                    commit(ORDERDETAIL_SET_LOADER,'animate40 animate100');
                });

        },
        [ORDERDETAIL_MULTI_ITEMS_CHECKED]:({commit}, payload)=>commit(ORDERDETAIL_MULTI_ITEMS_ADD,payload),
        [ORDERDETAIL_MULTI_ITEMS_UNCHECKED]:({commit}, payload)=>commit(ORDERDETAIL_MULTI_ITEMS_REMOVE,payload),
        [ORDERDETAIL_UPDATE_SUGGESTED_DELIVERY_DATE]:({commit},payload)=>{
            return axios.post('/suggestdate', {
                infoOrder_id:payload.infoOrder_id,
                suggested_delivery_date:payload.suggested_date

            }).then( (response)=>{
                if(response.data.update!==false){

                    commit(ORDERDETAIL_SET_SUGGESTED_DELIVERY_DATE,payload.suggested_date);

                }
                return Promise.resolve(response);
            })
                .catch((error)=>{
                    return Promise.reject(error);
                }).finally(()=>{

                });
        }

    },
    getters:{
        [ORDERDETAIL_GET_LOADER]:state=>state.loader,
        [ORDERDETAIL_GET_DETAILS]:state=>state.orderdetail,
        [ORDERDETAIL_GET_ALL_ITEMS_MULITCHECKED]:state=>state.selected_items,
    }
}
<template>
    <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeIn">
            <div class="container-fluid h-100 bg-color" v-if="showcontainer">
                <main-header></main-header>
                <div class="row d-flex align-content-stretch align-items-stretch flex-row hmax main-view-wrap" style="z-index:100" >
                <side-bar></side-bar>
                    <div class="col main-view p-0">
                        <h2 class="subtitle">Order List</h2>
                        <div class="container-fluid orderlist-tabs d-flex align-items-center">
                            <template v-for="(tab,tab_index) in tabs" :key="tab_index">
                                <div class="orderlist-tab body_bold" :class="{active:tab.active}" @click="showtab(tab_index)">{{tab.name}}</div>
                            </template>
                        </div>
                        <template v-for="(tab,tab_index) in tabs" :key="tab_index">
                            <order-list-table :tabledef="allordertablefields" :tab="tab" :id="tab_index" v-if="tab.active"></order-list-table>
                        </template>
                        <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
                            <div v-if="showlayer" class="back-layer"></div>
                        </transition>
                        <transition enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
                            <component :is="Component" />
                        </transition>
                    </div>
                </div>
            </div>
        </transition>
    </router-view>
</template>

<script>
    import {ref,onMounted,computed,nextTick} from 'vue';
    import MainHeader from '../layout/MainHeader';
    import {hasRoles} from '../helpers/helpers'
    import SideBar from '../layout/SideBar'
    import OrderListTable from './OrderListTable';
    import {useStore} from 'vuex';
    import {
        ORDERLIST_LOAD_LIST,
        ORDERLIST_MODULE,
        ORDERLIST_GET_CURRENT_SELECTED,
        ORDERLIST_SET_CURRENTTAB,
        ORDERLIST_GET_LIST,
        ORDERLIST_LOADERMSG,
        ORDERLIST_RESET_ORDERLIST, ORDERLIST_SET_LIMIT, ORDERLIST_LOAD_TAB
    } from '../../store/types/types';
    import {useRoute} from 'vue-router';

    export default {
        name: "OrderList",
        components: { SideBar, MainHeader,OrderListTable},
        setup(props,context){
            const showcontainer=ref(false);
            const store=useStore();
            const route=useRoute();

            const tabs=ref({});
            if(hasRoles(['cc'])){
                tabs.value= {
                    customer_care: {active: true, name: 'Customer Care'},
                    unfulfilled: {active: false, name: 'Unfulfilled'},
                    due_tomorrow: {active: false, name: 'Due tomorrow'},
                    without_delivery_date: {active: false, name: 'Without delivery date'},
                    with_partner: {active: false, name: 'With partner'},
                };
                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_SET_CURRENTTAB}`,'customer_care');
                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOADERMSG}`,'Loading customer care. Please wait...');
            }else  if(hasRoles(['user'])){
                tabs.value= {
                    due_today: {active: true, name: 'Due today'},
                    due_tomorrow: {active: false, name: 'Due tomorrow'},
                    all_orders: {active: false, name: 'All orders'},
                    customer_care: {active: false, name: 'Customer Care'},
                    with_partner: {active: false, name: 'With partner'},
                };
                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_SET_CURRENTTAB}`,'due_today');
                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOADERMSG}`,'Loading due today. Please wait...');
            }else {
                tabs.value= {
                    all_orders: {active: true, name: 'All orders'},
                    unfulfilled: {active: false, name: 'Unfulfilled'},
                    due_tomorrow: {active: false, name: 'Due tomorrow'},
                    without_delivery_date: {active: false, name: 'Without delivery date'},
                    with_partner: {active: false, name: 'With partner'},
                };
                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_SET_CURRENTTAB}`,'all_orders');
                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOADERMSG}`,'Loading order list. Please wait...');
            }
            const allordertablefields=ref({
                line_select:{
                    name:" ",
                    width:"3%",
                    sortable:false,
                    identifier:"id",
                    type:'checkbox',
                },
                id:{
                   name:"Order N°",
                    width:"10%",
                   sortable:false
               },
                express:{
                    name:" ",
                    width:"4%",
                    sortable:false,
                    type:'express'
                },
                Name:{
                    name:"Name",
                    width:"22%",
                    sortable:true
                },
                TypeDelivery:{
                    name:"Destination",
                    width:"10%",
                    css:"text-align:center",
                    sortable:true,
                    header_align:"center"
                },
                PromisedDate:{
                    name:"Promised Date",
                    width:"13%",
                    sortable:true,
                    css:"font-weight:bold;text-align:center",
                    header_align:"center"
                },
                numitems:{
                    name:"Items",
                    width:"7%",
                    sortable:true,
                    css:"text-align:center",
                    header_align:"center"
                },
                Status:{
                   name:"Order Status",
                   width:"13%",
                   sortable:true,
                    type:'tag',
                    header_align:"center",
                    css:"text-align:center",
                },
                paid:{
                    name:"Payment",
                    width:"13%",
                    sortable:true,
                    type:'tag',
                    header_align:"center"
                },
                Total:{
                    name:"Total",
                    width:"5%",
                    sortable:true,
                    type:'price',
                    css:"font-weight:bold;text-align:right;"
                }
            });
            onMounted(()=>{
                nextTick(()=>{
                    showcontainer.value=true;
                });
            });

            store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOAD_LIST}`);

            function showtab(tab) {
                for (const prop in tabs.value)
                    tabs.value[prop].active=false;

                tabs.value[tab].active=true;

                store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOAD_TAB}`,{tab:tab,name:tabs.value[tab].name});
               /* store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_SET_CURRENTTAB}`,tab);
                store.commit(`${ORDERLIST_MODULE}${ORDERLIST_RESET_ORDERLIST}`);
                store.commit(`${ORDERLIST_MODULE}${ORDERLIST_SET_LIMIT}`,{skip:0,take:10});

               // if(store.getters[`${ORDERLIST_MODULE}${ORDERLIST_GET_LIST}`].length==0) {
                    store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOADERMSG}`, `Loading ${tabs.value[tab].name.toLowerCase()}...`);
                    store.dispatch(`${ORDERLIST_MODULE}${ORDERLIST_LOAD_LIST}`);
              //  }
                console.log(tabs.value);*/
            }
            
            return {
                showtab,
                tabs,
                showcontainer,
                allordertablefields,
                showlayer:computed(()=>{return (route.params.order_id>0&&store.getters[`${ORDERLIST_MODULE}${ORDERLIST_GET_CURRENT_SELECTED}`]);})
            }
        }
    }
</script>

<style scoped>

    .hmax{
        height: calc(100% - var(--mainlogoheight));
        padding-top:var(--mainlogoheight) ;
    }

    .auth-logo{
        height: var(--authlogoheight);
    }
    .back-layer{
        background:rgba(224, 224, 224,0.6);
        position: fixed;
        top: 0;
        left:0;
        height: 100%;
        width: 100%;
        z-index: 9999;
    }
</style>
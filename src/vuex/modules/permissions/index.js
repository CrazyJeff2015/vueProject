/**
 * Created by zhoutao on 2017/4/11.
 */
/**
 * Created by admin on 2017/1/12.
 */

import actions from './actions';
import mutations from './mutations';
export default {
  state: {
    permissionsData:{
      retrieve_reguser:false,freeze_reguser:false,thaw_reguser:false,give_reguser:false,creat_reguser:false,view_user:false,viewmsg_user:false,modify_user:false,viewlogin_user:false,viewgmlog_user:false,viewgoldlog_user:false,userlog_user:false,view_onlineuser:false,coefficient_onlineuser:false,creat_role:false,edit_roleintroduce:false,edit_rolejurisdiction:false,del_rolejurisdiction:false,view_userbackregist:false,view_userbacklist:false,view_goldmanager:false,view_goldblack:false,viewblack_black:false,blackgold_black:false,opration_goldblack:false,backblack_goldblack:false,view_accountingblack:false,opration_accountingblack:false,back_accountingblack:false,gameManagement:false,fishManagement:false,opration_queryorder:false,view_payorder:false,cut_coefficient:false,view_operation_list:false,view_bank_list:false,change_bank_score:false,view_score_log:false,view_download:false,edit_download:false,view_notice:false,edit_notice:false,view_user_score:false,view_game_count:false,view_market_log:false,view_game_log:false,pokerManagement:false,reset_user_score:false,update_agent_score:false,view_all_service_list:false,edit_bank_score_limit:false,view_operation_childaccount:false,view_service_list:false,give_score:false,post_reduce_score:false,view_system_log:false,add_test_user:false,system_notice_list:false,syetem_notice_manage:false,system_message_manage:false,system_answer_manage:false,operation_online:false,operation_edit:false,operation_work:false,operation_game_count:false,operation_remove:false,view_cname_list:false,create_cname:false,edit_cname:false,delete_cname:false,view_next_agent:false,view_consume:false,next_agent_activation:false,next_agent_scale:false,next_agent_info:false,next_agent_admin_pwd:false,next_agent_pwd:false,next_agent_score:false,next_agent_set_operation:false,view_customer_list:false,view_operation_customer_list:false,view_admin_customer_list:false,donation_amount:false,view_customer_consume:false,view_sole_count:false,view_admin_sole_count:false,view_profit_list:false,view_admin_profit_list:false,update_profit:false,view_commission_record:false,view_admin_commission_record:false,view_agent_count:false,view_allstatistical:false,agent_safe:false,view_money:false,view_agent_link:false,view_agent_agentstadus:false,create_agent_link:false,edit_agent_link:false,delete_agent_link:false,create_content:false,update_content:false,view_content:false,view_next_sole_agent:false,sole_send_score:false,view_sole_next_agent:false,adj_score:false,view_agenttocustomer:false,view_sole_score_log:false,view_push_log:false,view_admin_info_list:false,view_notice_manager:false,view_admin_manager:false,view_manager_list:false,view_chaild_manager:false,view_role_list:false,view_opr_list:false,set_agent:false,view_total_manager_list:false,view_sole_commission_record:false,view_operation_payorder:false,view_agent_next:false,create_prompt:false,score_transform:false,view_user_list:false,view_admin_next_agent:false,view_sole_data:false,fast_juge:false,view_admin_agent_pay:false,view_oper_agent_pay:false,view_admin_pay_log:false,view_oper_pay_log:false,view_operprofit_list:false,oper_fast_juge:false,view_sole_log:false,view_agent_num_info:false,batch_juge:false
    }
  },
  actions: actions,
  mutations: mutations,
  getters:{
    getPermissionsData(state){
      return state.msg;
    }
  }
};

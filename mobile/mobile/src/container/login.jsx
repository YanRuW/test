import React, {Component, Fragment} from "react";
import { List, InputItem, Toast,Button, WhiteSpace, } from 'antd-mobile';
export default class Login extends Component{
    render(){
        return(
        <section className="contain">
            <div className="login">     
                <List>
                    <InputItem
                        placeholder="员工号"
                    >
                        <div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
                    </InputItem>
                    <InputItem
                        placeholder="密码"
                    >
                        <div style={{ backgroundImage: 'url(https://zos.alipayobjects.com/rmsportal/DfkJHaJGgMghpXdqNaKF.png)', backgroundSize: 'cover', height: '22px', width: '22px' }} />
                    </InputItem>
                </List>
                <Button type="primary" onClick={this.handleLogin.bind(this)}>登录</Button><WhiteSpace />
                
            </div>
        </section>
        )
    }
    handleLogin(){

    }
}
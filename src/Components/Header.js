import React, { Component } from 'react'
import './Header.css'
import axios from 'axios'

export default class Header extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            isAdmin: false,
        }
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.logout = this.logout.bind(this)
    }
    handleUsernameInput(e){
        // should update this.state.username  based on user input. Do not mutate state, use setState.
        this.setState({
            username: e.target.value
        })
    }
    handlePasswordInput(e){
        // should update this.state.password based on user input. Do not mutate state, use setState.
        this.setState({
            password: e.target.value
        })
    }

    toggleAdmin () {
        // should toggle the value of isAdmin on state, by setting it to the value of it's opposite. (!this.state.isAdmin)
        this.setState({
            isAdmin: !this.state.isAdmin
        })
    }

    login () {
        // create POST request to login endpoint
        const {username, password, isAdmin} = this.state
        axios.post('/auth/login', {username, password}).then(() => {
            this.setState({
                username: '',
                password: ''
            })
            this.props.updateUser({username, isAdmin})
            console.log('run this',isAdmin)
        })
    }

    register () {
        // create POST request to register new user
        const {username, password, isAdmin} = this.state
        axios.post('/auth/register', {username, password}).then(() => {
            this.setState({
                username: '',
                password: ''
            })
            this.props.updateUser({username, isAdmin})
        })
    }

    logout () {
        // GET request to logout
        axios.get('/auth/logout').then(() => {
            this.props.updateUser({})
        })
    }

    render() {
        const { username, password } = this.state
        const { user } = this.props
        return (
            <div className='Header'>
                <div className="title">Dragon's Lair</div>
                {
                    user.username ?
                    (<div className='welcomeMessage'>
                            <h4>{user.username}, welcome to the dragon's lair</h4>
                            <button type="submit" onClick={this.logout}>Logout</button>
                        </div>
                        )
                        :
                        <div className="loginContainer">

                            <input type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => {this.handleUsernameInput(e)}}
                            />
                            <input type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {this.handlePasswordInput(e)}}
                            />
                            <div className='adminCheck' >
                                <input type="checkbox" id='adminCheckbox' onChange={() => {this.toggleAdmin()}} /> <span> Admin </span>
                            </div>
                            <button onClick={this.login}>Log In</button>
                            <button onClick={this.register} id='reg' >Register</button>

                        </div>}
            </div>
        )
    }
}

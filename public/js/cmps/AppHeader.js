import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import LoginSignup from './LoginSignup.js'

export default {
    template: `
        <header>
            <h1>Miss Bug</h1>    
            <div class="user-login">
                <section v-if="user">
                    <p>
                        Welcome 
                        <RouterLink :to="'/user/' + user._id">
                            {{user.fullname}}
                        </RouterLink>
                    </p>
                    <button @click="logout">Logout</button>
                </section>
                <section v-else>
                    <LoginSignup @setUser="onSetUser" />
                </section>
            </div>
            <a href="/api/download" target="_blank">Download PDF</a>   
        </header>
    `,
    data() {
        return {
            user: userService.getLoggedinUser()
        }
    },
    methods: {
        logout(){
            userService.logout()
            .then(()=>{
                this.user = null
                this.$router.push('/')
            }) 
            .catch(err => {
                console.log('Cannot logout', err)
                showErrorMsg(`Cannot logout`)
            })
        },
        onSetUser(user){
            this.user = user
            this.$router.push('/')
        }
    },
    components: {
        LoginSignup
    }
}

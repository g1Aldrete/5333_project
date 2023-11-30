import "./../App.css"
import { Link } from "react-router-dom";

function Login() {
    return (
        <>
            <div className="login">
                <form className="form">
                    <h2>Log In</h2>
                    <label>Email</label>
                    <input type="email" id="email" name="email" required></input>
                    <label>Password</label>
                    <input type="password" id="password" name="password" required></input>
                    <button>Log In</button>
                    <p>Don't have an account yet? <Link to="/register">Sign Up</Link></p>
                </form>
            </div>
        </>
    );
}

export default Login;
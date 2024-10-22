import { Link } from "react-router-dom";

const NavBar = () => {


    return (
        <div className="flex justify-around items-center w-full mt-8 p-4 bg-stone-50 shadow-md rounded-xl text-black">


            <button className="p-2 home">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 17v-5.548c0-.534 0-.801-.065-1.05a2 2 0 0 0-.28-.617c-.145-.213-.345-.39-.748-.741l-4.8-4.2c-.746-.653-1.12-.98-1.54-1.104c-.37-.11-.764-.11-1.135 0c-.42.124-.792.45-1.538 1.102L5.093 9.044c-.402.352-.603.528-.747.74a2 2 0 0 0-.281.618C4 10.65 4 10.918 4 11.452V17c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.082 1.083C5.602 20 6.068 20 7 20s1.398 0 1.766-.152a2 2 0 0 0 1.082-1.083C10 18.398 10 17.932 10 17v-1a2 2 0 1 1 4 0v1c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.082 1.083C15.602 20 16.068 20 17 20s1.398 0 1.766-.152a2 2 0 0 0 1.082-1.083C20 18.398 20 17.932 20 17" />
                </svg>
            </button>

            <button className="p-2 stats">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15v1.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H21M3 15V5m0 10l3.853-3.21l.004-.003c.697-.581 1.046-.872 1.425-.99a2 2 0 0 1 1.362.061c.367.153.688.474 1.332 1.118l.006.006c.654.654.981.982 1.354 1.133a2 2 0 0 0 1.385.046c.383-.128.733-.434 1.433-1.046L21 7" />
                </svg>
            </button>

            <Link to="/logMeal">
                <button className="bg-black p-2 rounded-full text-white add">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h6m0 0h6m-6 0v6m0-6V6" />
                    </svg>
                </button>
            </Link>

            
            <button className="p-2 recipes">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4h-.8c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.427.218.987.218 2.105.218H8M8 4h8.8c1.12 0 1.68 0 2.107.218c.377.192.683.497.875.874c.218.427.218.987.218 2.105v9.607c0 1.118 0 1.677-.218 2.104a2 2 0 0 1-.875.874c-.427.218-.986.218-2.104.218H8M8 4v16m4-9h4m-4-3h4" />
                </svg>
            </button>

            <button className="p-2 profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 21c0-2.761-3.582-5-8-5s-8 2.239-8 5m8-8a5 5 0 1 1 0-10a5 5 0 0 1 0 10" />
                </svg>
            </button>
        </div>
    );
};
export default NavBar;
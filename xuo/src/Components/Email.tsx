import React from 'react';

export default function Contact() {
    const [result, setResult] = React.useState("");

    const onSubmit = async (event: any) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);

        formData.append("access_key", "8c5a90a1-fce6-44f2-8a6f-39476f803315");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            setResult("Form Submitted Successfully");
            event.target.reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }
    };

    return (
        <div className="p-2 bg-transparent rounded-lg max-w-md mx-auto">
            <form onSubmit={onSubmit} className="bg-transparent rounded-lg px-4 pt-4 pb-4 mb-2 flex flex-col">
                <input 
                    type="text" 
                    name="name" 
                    required 
                    className="bg-transparent shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight mb-2 font-semibold"
                    placeholder="Name"
                />
                <input 
                    type="email" 
                    name="email" 
                    required 
                    className="bg-transparent shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-3 text-gray-400 leading-tight mb-2 font-semibold"
                    placeholder="Email"
                />
                <textarea 
                    name="message" 
                    required 
                    className="bg-transparent shadow appearance-none border-2 border-gray-700 rounded-lg w-full py-2 px-3 text-gray-400 leading-tight focus:outline-none mb-2 h-[100px] font-semibold"
                    placeholder="Message"
                ></textarea>
                <span className="text-gray-700">{result}</span>
                <div className="flex justify-center mt-4">
                    <button 
                        type="submit" 
                        className="bg-transparent w-20 border-2 border-gray-700 text-gray-500 hover:bg-gray-700 hover:text-white font-bold py-1 px-2 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}

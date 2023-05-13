import Link from "next/link"

export default function Onboarding() {
  return (
    <div className=" items-center px-5 py-12 lg:px-20">
        <div className="flex flex-col w-full max-w-3xl p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-white rounded-lg md:mt-0">
                <section className="flex flex-col w-full h-full p-1 overflow-auto">
                    <header className="flex flex-col items-center justify-center py-12 text-base transition duration-500 ease-in-out transform bg-white border border-dashed rounded-lg text-blueGray-500 focus:border-blue-500 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2">
                        <p className="flex flex-wrap justify-center mb-3 text-base leading-7 text-blueGray-500">
                            <span>Drag and drop your files anywhere or</span></p>
                        <button className="btn btn-outline"> Upload file</button>
                        </header>
                </section>
        </div>
        <div className="flex flex-col w-full max-w-3xl p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-white rounded-lg md:mt-0">
                    <form action="#" method="POST" className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                            <div className="form-control">
                                <label className="label"> 
                                    <span className="label-text">First name</span>
                                 </label>
                                <input type="text" className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label"> 
                                    <span className="label-text">Last name</span>
                                 </label>
                                <input type="text" className="input input-bordered" />
                            </div>
                        </div>
                        <div className="form-control">
                                <label className="label"> 
                                    <span className="label-text">Input</span>
                                 </label>
                                <input type="text" className="input input-bordered" />               
                        </div>
                        <div className="form-control">
                            <button type="submit" className="btn btn-primary">Next</button>
                        </div>
                    </form>
                </div>
        </div>
        
    
)
}

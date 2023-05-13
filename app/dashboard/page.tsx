import Link from "next/link";

export default function Onboarding() {
  return (
    <div className=" items-center px-5 py-12 lg:px-20">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-row justify-center items-center space-x-7">
          <article className="prose">
            <h1 className="text-8xl">12 d 12 h 23 d</h1>
          </article>
          <button className="btn">Renew</button>
        </div>

        <div className="flex-1 flex flex-row justify-center items-center space-x-7">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <p className="text-slate-400">Amount to be collected</p>
              <h2 className="card-title text-3xl">$25 000</h2>
            </div>
          </div>

          <div className="form-control w-96 max-w-l">
            <label className="label">
              <span className="label-text">Beneficiary Address</span>
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Address"
                className="input input-bordered w-full max-w-xs"
                value="0x2f5f9a1b383aBdBE29C237EfCeC6Cb659B672d88"
              />
              <button className="btn">Update</button>
            </div>
          </div>
        </div>

        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Token</th>
              <th>Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td>USDC</td>
              <td>0x</td>
              <td>25000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

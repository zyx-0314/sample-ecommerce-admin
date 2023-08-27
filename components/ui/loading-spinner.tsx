import { CircleLoader } from "react-spinners"

const LoadingSpinner = () =>
{
  return (
    <>
      <div className="h-[98vh] w-full p-2 my-2 border-3 border-white flex items-center justify-center flex-col gap-y-3">
        <CircleLoader color="#36d7b7" loading />
        <div className="">
          <p className="tracking-widest font-extrabold text-xl">LOADING . . .</p>
        </div>
      </div>
    </>
  )
}

export default LoadingSpinner
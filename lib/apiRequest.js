//import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export async function makePostRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  reset,
  onSuccess
){
  
   
try {
     setLoading(true);
     const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
    const response =await fetch(url ,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    }
  )
 
    if(response.ok){
      
      setLoading(false)
      toast.success(`New ${resourceName} Created Successfully`)
      reset?.();
      onSuccess?.();
    }
    else{
      setLoading(false)
      const errorData = await response.json().catch(() => null);
      toast.error(errorData?.message || "Something went wrong")
        
    }

    
    

} catch (error) {
  setLoading(false)
  console.log(error)
}

}

export async function makePutRequest(
  setLoading,
  endpoint,
  data,
  resourceName,
  redirect,
  reset
){
  
   
try {
  
     setLoading(true);
     const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
    const response =await fetch(url ,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    }
  )
    if(response.ok){
      console.log(response)
      setLoading(false)
      toast.success(` ${resourceName} Updated Successfully`)
      redirect()
    }
    else{
          setLoading(false)
          const errorData = await response.json().catch(() => null);
          toast.error(errorData?.message || "Something went wrong")
    }

    
    

} catch (error) {
  setLoading(false)
  console.log(error)
}

}

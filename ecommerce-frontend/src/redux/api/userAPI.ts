
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";   
import axios from "axios";
import toast from "react-hot-toast";




export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/` }),
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse , User>({
            query: (user) => ({
                url: `new`,
                method: "POST",
                body:user,
            }),
        }),
    }),

});

export const getUser = async (id: string) => {
    try{
        const {data}: {data:UserResponse} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
        return data;
    }catch(error){
        toast.error("Failed to get user");
    }
}

export const useLoginMutation: any = userAPI.useLoginMutation;
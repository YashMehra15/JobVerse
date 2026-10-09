import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'

const useGetUserProfile = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(s => s.auth)

    useEffect(() => {
        if (user) return
        axios.get(`${USER_API_END_POINT}/profile`, { withCredentials: true })
            .then(res => {
                if (res.data.success) dispatch(setUser(res.data.user))
            })
            .catch(() => {})
    }, [])
}

export default useGetUserProfile
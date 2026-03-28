import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector(store => store.auth)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    file: null,
  })
  const dispatch = useDispatch()

  const changeHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
  const fileHandler = (e) => setInput({ ...input, file: e.target.files?.[0] })

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(input).forEach(([k, v]) => { if (k !== 'file' && v) formData.append(k, v) })
    if (input.file) formData.append('file', input.file)
    try {
      setLoading(true)
      const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true
      })
      if (res.data.success) {
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  const fields = [
    { name: 'fullname', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
    { name: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
    { name: 'phoneNumber', label: 'Phone Number', placeholder: '9876543210', type: 'text' },
    { name: 'bio', label: 'Bio', placeholder: 'A short description about yourself', type: 'text' },
    { name: 'skills', label: 'Skills', placeholder: 'React, Node.js, Python (comma separated)', type: 'text' },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl border-gray-100 p-7 max-w-lg">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Clash Display' }}>
            Update Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-4">
          {fields.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <Label className="text-gray-700 font-medium text-sm mb-1.5 block">{label}</Label>
              <Input name={name} type={type} value={input[name]} onChange={changeHandler} placeholder={placeholder}
                className="h-10 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-400 transition-all" />
            </div>
          ))}
          <div>
            <Label className="text-gray-700 font-medium text-sm mb-1.5 block">Resume / CV</Label>
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 cursor-pointer transition-all group bg-gray-50 hover:bg-indigo-50">
              <Upload className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
              <span className="text-sm text-gray-500 group-hover:text-indigo-600">
                {input.file ? input.file.name : 'Upload PDF resume'}
              </span>
              <input type="file" accept=".pdf" onChange={fileHandler} className="sr-only" />
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}
              className="flex-1 rounded-xl border-gray-200">Cancel</Button>
            <Button type="submit" disabled={loading}
              className="flex-1 rounded-xl btn-amber shadow-lg shadow-indigo-200">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog

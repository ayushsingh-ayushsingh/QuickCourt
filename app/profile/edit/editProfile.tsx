"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { updateProfileAction } from "@/app/actions/updateProfileAction"

export default function EditProfilePage({
    userEmail = "user@example.com",
    currentRole = "user",
    currentName = "",
    currentImage = ""
}: {
    userEmail?: string
    currentRole?: string
    currentName?: string
    currentImage?: string
}) {
    const router = useRouter()
    const [name, setName] = useState(currentName)
    const [role, setRole] = useState(currentRole)
    const [imageBase64, setImageBase64] = useState(currentImage)
    const [preview, setPreview] = useState(currentImage)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            setImageBase64(base64String)
            setPreview(base64String)
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", name)
        formData.append("role", role)
        formData.append("image", imageBase64)

        const result = await updateProfileAction(formData);

        if (result.message) {
            toast.info(result.message);
        } else {
            toast.success("Profile Updated");
        }

        router.push("/profile/edit");
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <Label className="mb-2" htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Role Select */}
                <div>
                    <Label className="mb-2" htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger id="role" className="w-full">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="owner">Facility Owner</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Image Upload */}
                <div>
                    <Label className="mb-2" htmlFor="image">Profile Image</Label>
                    <Input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Preview */}
                {preview && (
                    <div className="w-32 h-32 mt-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full border"
                        />
                    </div>
                )}

                {/* Email (Disabled) */}
                <div>
                    <Label className="mb-2" htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={userEmail}
                        disabled
                        className="bg-muted cursor-not-allowed"
                    />
                </div>

                <Button type="submit" className="w-full">Save Changes</Button>
            </form>
        </div>
    )
}

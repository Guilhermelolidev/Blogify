"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
)
import { useState, useRef, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { toast } from "react-hot-toast";
import axios from "axios";
import { getCategories } from "@/lib/helpers";
import { CategoryType } from "@/lib/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import dynamic from "next/dynamic";

const BlogAdd = () => {
    const { data: session } = useSession();
    const [imageUrl, setImageUrl] = useState<any>("");
    const [editorState, setEditorState] = useState<EditorState | null>(null);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setEditorState(EditorState.createEmpty());
    }, []);

    const convertEditorDataToHTML = () => {
        //@ts-ignore
        return draftToHtml(convertToRaw(editorState.getCurrentContent()));
    };

    const handleEditorStateChange = (e: any) => {
        setEditorState(e);
    };

    const handlePost = async (data: any) => {
        const formData = new FormData();
        const postData = JSON.stringify({
            title: data.title,
            description: convertEditorDataToHTML(),
            location: data.location,
            userId: session?.user.id,
            categoryId: data.category,
        });

        formData.append("postData", postData);
        formData.append("image", imageUrl);

        try {
            toast.loading("Sending your post to world 🌎", { id: "postData" });
            await axios.post("http://localhost:3000/api/blogs", formData);

            toast.success("Sent your post to world 🌎", { id: "postData" });
        } catch (err) {
            toast.error("Sending Failed", { id: "postData" });

            return console.log(err);
        }
    };
    return (
        <section className="w-full">
            <div className="flex justify-between p-4 items-center">
                <div className="w-1/4">
                    <span className=" font-extrabold mx-3">Author:</span>
                    <span className=" uppercase font-semibold">
                        {session?.user?.name}
                    </span>
                </div>
                <button
                    onClick={handleSubmit(handlePost)}
                    className="bg-violet-600 text-white  px-6 focus:ring-violet-950 py-3 rounded-2xl font-bold shadow-xl hover:bg-violet-700"
                >
                    Publish
                </button>
            </div>
            <Suspense>
                {imageUrl && (
                    <Image
                        className="mx-auto my-20 rounded-lg shadow-xl border-[3px] border-slate-900"
                        src={URL.createObjectURL(imageUrl)}
                        alt="NewPost"
                        width={800}
                        height={400}
                    />
                )}
            </Suspense>
            <div className="w-full flex my-5">
                <input
                    placeholder="Enter Title"
                    type="text"
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold "
                    {...register("title", { required: true })}
                />
            </div>
            <div className="w-full flex my-5">
                <input
                    type="file"
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold "
                    onChange={(event) => {
                        if (event.target.files) {
                            setImageUrl(event.target.files[0]);
                        }
                    }}
                />
            </div>
            <div className="w-full flex my-5">
                <input
                    placeholder="Location Ex: Delhi, India"
                    type="text"
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold "
                    {...register("location", { required: true })}
                />
            </div>
            <div className="w-full flex my-5">
                <select
                    className="md:w-[500px] sm:w-[300px] m-auto text-slate-900 bg-gray-100 p-4 rounded-xl font-semibold "
                    {...register("category", { required: true })}
                >
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <Editor
                //@ts-ignore
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                editorStyle={{
                    minHeight: "50vh",
                    height: "auto",
                    border: "1px solid #000",
                    padding: 10,
                }}
            />
        </section>
    );
};

export default BlogAdd;
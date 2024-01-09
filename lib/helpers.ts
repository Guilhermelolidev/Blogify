import prisma from "@/prisma";
import axios from "axios";
import { DefaultUser } from "next-auth";
import { NextResponse } from "next/server";

export const connectToDb = async () => {
    try {
        await prisma.$connect();
    } catch (err: any) {
        throw new Error(err);
    }
};

export const generateSuccessMessage = (data: any, status: number) => {
    return NextResponse.json(
        { message: "Success", ...data },
        { status, statusText: "OK" }
    );
};

export const generateErrorMessage = (data: any, status: number) => {
    return NextResponse.json(
        { message: "Error", ...data },
        { status, statusText: "ERROR" }
    );
};

export const getAllBlogs = async (count?: number) => {
    const res = await axios.get("http://localhost:3000/api/blogs");
    const data = await res.data;

    if (count) {
        return data.blogs.slice(0, count);
    }

    return data.blogs;
};

export const getBlogById = async (id: string) => {
    const res = await axios.get(`http://localhost:3000/api/blogs/${id}`);
    const data = await res.data;
    return data.blog;
};

export const getBlogs = async () => {
    const res = await axios.get("http://localhost:3000/api/blogs", {});
    const data = await res.data;

    return data.blogs;
};

export const getCategories = async () => {
    const res = await axios.get("http://localhost:3000/api/categories", {});
    const data = await res.data;

    return data.categories;
};

export const getUserById = async (id: string) => {
    const res = await axios.get(`http://localhost:3000/api/users/${id}`);
    const data = await res.data;
    return data;
};

export const updateBlog = async (id: string, postData: any) => {
    const res = await axios.put(`http://localhost:3000/api/blogs/${id}`, {
        ...postData,
    });
    const data = await res.data;
    return data.blog;
};

export const verifyUserDetails = async (user: DefaultUser) => {
    await connectToDb();
    const isUserExists = await prisma.user.findFirst({
        where: { email: user.email as string },
    });
    if (isUserExists) {
        return null;
    } else {
        const newUser = await prisma.user.create({
            data: {
                email: user.email as string,
                name: user.name as string,
            },
        });
        return newUser;
    }
};
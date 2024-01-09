"use client";
import { FaSearch } from "react-icons/fa";
import BlogItem from "../components/BlogItem";
import { BlogItemType, CategoryType } from "@/lib/types";
import { CSSProperties, useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { getBlogs, getCategories } from "@/lib/helpers";
import CircleLoader from "react-spinners/BeatLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    marginLeft: "20px"
};

const BlogsPage = () => {
    const [searchText, setSetsearchText] = useState("");
    const [blogs, setBlogs] = useState<BlogItemType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [filters, setFilters] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [filteredData, setFilteredData] = useState<BlogItemType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const blogsData = await getBlogs();
                setBlogs(blogsData);
                setFilteredData(blogsData);

                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error(error);
                setLoading(false)
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredData(blogs.filter((blog) => blog.title.toLowerCase().includes(searchText.toLowerCase())));
    }, [searchText]);

    useEffect(() => {
        setFilteredData(blogs.filter((blog) => blog.categoryId === filters));
    }, [filters]);

    return (
        <section className="w-full h-full">
            <div className="flex flex-col gap-3 my-10 p-8 ">
                <h4 className="text-3xl font-semibold">
                    Explore Articles On Various Categories
                </h4>
                <p className="text-xl font-semibold">
                    Practical Articles For Learning Anything
                </p>
            </div>
            {loading ? (
                <CircleLoader
                    color="blue"
                    loading={loading}
                    cssOverride={override}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            ) : (
                <>
                    <nav className="bg-gray-100 border w-full flex my-4 sticky top-0 bg-center gap-4 h-20  md:p-8 xs:p-2 justify-between items-center">
                        <div className="mr-auto flex md:w-1/4 xs:w-2/4 items-center gap-6">
                            <p className="font-semibold text-2xl">Filter</p>
                            <Select onValueChange={(e) => setFilters(e)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent >
                                    {
                                        categories && categories.map((item) => (
                                            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-2/4 flex ml-auto md:gap-6 xs:gap-2 items-center">
                            <p className="font-semibold text-2xl">Search</p>
                            <Input onChange={(e) => setSetsearchText(e.target.value)} type="text" />
                            <FaSearch className="cursor-pointer" />
                        </div>
                    </nav>
                    <div className="flex gap-4 flex-wrap justify-center my-1">
                        {filteredData?.map((blog: BlogItemType) => (
                            <BlogItem {...blog} key={blog.id} />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default BlogsPage;
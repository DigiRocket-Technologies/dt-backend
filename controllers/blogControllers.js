import Blog from "../models/blog.js";

export const getallblogsadmin = async (req, res) => {

    try {

        const blogs = await Blog.find({});

        console.log(blogs);

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            blogs
        })

    } catch (err) {
        console.log('Error in get blogs controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }

}

export const getallblogs=async (req, res) => {
    try {

        const blogs = await Blog.find({ live: true });

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            blogs
        })

    } catch (err) {
        console.log('Error in get blogs controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const getblogdetails=async (req, res) => {
    try {
        const slug = req.params.slug
        if (!slug)
            return res.status(400).json({
                success: false,
                message: 'No blog choosen '
            })

        const blog = await Blog.findOne({ slug });



        return res.status(200).json({
            success: true,
            message: 'Blog details fetched successfully',
            blog
        })

    } catch (err) {
        console.log('Error in get blogs controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const addblog=async (req, res) => {
    try {
        const { content, formData } = req.body

        const { title, metaDescription = "", scriptTags = [],
            thumbnail = "",slug, heading="" } = formData

        if (!title || !content|| !slug) {
            return res.status(200).json({
                success: false,
                message: 'title and content are necessary to save blog',
            })
        }

        const blog = new Blog({
            title,
            thumbnail,
            content,
            slug:slug.trim().toLowerCase().replace(/\s+/g, "-"),
            h1:heading,
            metaDescription,
            scriptTags
        })

        await blog.save();

        return res.status(200).json({
            success: true,
            message: 'Blog added successfully',
        })

    } catch (err) {
        console.log('Error in add blog controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const editblogdetails=async (req, res) => {
    try {
        const { content, formData, id } = req.body

        const { title, metaDescription = "", scriptTags = [],
            thumbnail = "".heading="",slug } = formData

        if (!id) {
            return res.status(200).json({
                success: false,
                message: 'No blog choosen to edit',
            })
        }


        if (!title || !content || ! slug) {
            return res.status(200).json({
                success: false,
                message: 'title and content are necessary to save blog',
            })
        }

        const blog = await Blog.findOneAndUpdate({ _id: id }, {
            title,
            thumbnail,
            content,
            metaDescription,
            slug:slug.trim().toLowerCase().replace(/\s+/g, "-"),
            h1:heading,
            scriptTags
        })

        return res.status(200).json({
            success: true,
            message: 'Blog edited sucessfully',
            blog
        })

    } catch (err) {
        console.log('Error in edit blog controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const deleteblog= async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(200).json({
                success: false,
                message: 'No blog choosen to delete',
            })
        }

        const blog = await Blog.findOneAndDelete({ _id: id })

        return res.status(200).json({
            success: true,
            message: 'Blog deleted sucessfully',
            blog
        })

    } catch (err) {
        console.log('Error in delete blog controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}

export const altervisibility=async (req, res) => {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(200).json({
                success: false,
                message: 'No blog choosen to alter visibilty',
            })
        }

        const blog = await Blog.findOne({ _id: id })

        if (blog?.live === false)
            blog.live = true;
        else
            blog.live = false;

        await blog.save();

        return res.status(200).json({
            success: true,
            message: 'Blogs visibility altered sucessfully',
            blog
        })

    } catch (err) {
        console.log('Error in alter blog visibilty controller', err)
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}
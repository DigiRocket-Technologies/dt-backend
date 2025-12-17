import Blog from "../models/blog.js";

export const getallblogsadmin = async (req, res) => {
  const { ToggleValue, pageNo, sortNo } = req.params;

  try {
    const skipNumber = (pageNo - 1) * 5;

    let query = {};
    let sortOption = { [ToggleValue]: parseInt(sortNo) };

    if (ToggleValue === "live") {
      if (parseInt(sortNo) === -1) {
        query = { live: true };
      } else if (parseInt(sortNo) === 1) {
        query = { live: false };
      }
    }

    const blogSize = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort(sortOption)
      .skip(skipNumber)
      .limit(5);

    const noOfPage = Math.ceil(blogSize / 5);

    return res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
      blogSize,
      noOfPage,
    });
  } catch (err) {
    console.log("Error in get blogs controller", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getallblogsadminSearch = async (req, res) => {

  try {
    const blogs = await Blog.find({});

    return res.status(200).json({
      success: true,
      blogs,
    })

  } catch (err) {
    console.log('Error in get blogs controller', err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getallblogs = async (req, res) => {
  const { pageNo } = req.params;
  try {
    const skipNumber = (pageNo - 1) * 6;
    const blogs = await Blog.find({ live: true }).skip(skipNumber)
      .limit(6);
    const blogSize = await Blog.countDocuments({ live: true });
    const noOfPage = Math.ceil(blogSize / 6);

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      blogs,
      noOfPage,
      blogSize
    })

  } catch (err) {
    console.log('Error in get blogs controller', err)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    })
  }
}

export const getblogdetails = async (req, res) => {
  try {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'No blog chosen',
      });
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog details fetched successfully',
      blog,
    });

  } catch (err) {
    console.log('Error in get blog details controller', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


export const addblog = async (req, res) => {
  // console.log(req.body);
  try {
    const { content, formData } = req.body

    const { title, metaDescription = "", scriptTags = [],
      thumbnail = "", slug, heading = "" } = formData

    if (!title || !content || !slug) {
      return res.status(200).json({
        success: false,
        message: 'title and content are necessary to save blog',
      })
    }

    const blog = new Blog({
      title: heading,
      thumbnail,
      content,
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
      h1: title,
      metaDescription,
      scripts: scriptTags
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

export const editblogdetails = async (req, res) => {
  try {
    const { content, formData, id } = req.body;
    const {
      title,
      metaDescription = "",
      scriptTags = [],
      thumbnail = "",
      heading = "",
      slug,
    } = formData;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "No blog chosen to edit",
      });
    }

    if (!title || !content || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title, slug, and content are required",
      });
    }

    const normalizedSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    // 🧠 Check if another blog already uses this slug
    const existingSlug = await Blog.findOne({
      slug: normalizedSlug,
      _id: { $ne: id }, // exclude current blog
    });

    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: `Slug "${normalizedSlug}" is already in use by another blog`,
      });
    }

    // 🛠️ Now safely update
    const blog = await Blog.findOneAndUpdate(
      { _id: id },
      {
        title,
        thumbnail,
        content,
        metaDescription,
        slug: normalizedSlug,
        h1: heading,
        scripts: scriptTags,
      },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog edited successfully",
      blog,
    });
  } catch (err) {
    console.error("Error in edit blog controller:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteblog = async (req, res) => {
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

export const altervisibility = async (req, res) => {
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

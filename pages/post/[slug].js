import { useContext, useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Typography,
  List,
  Avatar,
  Divider,
  Button,
  Input
} from "antd";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";
import Editor from "rich-markdown-editor";
import { ThemeContext } from "../../context/theme";
import CommentForm from "../../components/comments/CommentForm";
import { ShareSocial } from "react-share-social";
import useCategory from "../../hooks/useCategory";
import useLatestPosts from "../../hooks/useLatestPosts";
import relativeTime from "dayjs/plugin/relativeTime";
import EditPost from "../../components/posts/EditPostComponent";
dayjs.extend(relativeTime);

const { Title } = Typography;

const { Meta } = Card;

export const SinglePost = ({ post, postComments }) => {
  const [theme, setTheme] = useContext(ThemeContext);
  // comments
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [featuredImage, setFeaturedImage] = useState(post.featuredImage);
  
  const [comments, setComments] = useState(postComments);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const[editPost, setEditPost] = useState(false);
  // hooks
  const { categories } = useCategory();
  const { latestPosts } = useLatestPosts();

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/comment/${post._id}`, { comment });
      setComments([data, ...comments]);
      setComment("");
      toast.success("Comment posted successfully");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  const updatePost = async () => {
    try {
      setLoading(true);
      const postId=post._id
      const { data } = await axios.put(`/edit-post-onpage/${postId}`, {
        title,
        content,
        featuredImage,
        categories
      });
      console.log("POST PUBLISHED RES => ", data);
      toast.success("Post updated successfully");
setTitle(data.title);
setContent(data.content);
setEditPost(false);
alert("Post updated successfully");
      router.push(`/posts`);
      if (data?.error) {
        toast.error(data?.error);
        setLoading(false);
      } else {
         console.log("POST PUBLISHED RES => ", data);
        toast.success("Post updated successfully");
  setTitle(data.title);
  setContent(data.content);
  setEditPost(false);
  alert("Post updated successfully");
        router.push(`/posts`);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  const searchItems = (searchValue) => {
    console.log(searchValue);

    setSearchInput(searchValue);
    if (searchInput !== "") {
      const filteredData = allPosts.filter((item) => {
        return item.title.toLowerCase().includes(searchInput.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(allPosts);
    }
  };
  

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta description={post.content.substring(0, 160)} />
      </Head>
      <Row>
        <Col xs={24} xl={16}>
          <Card
            cover={
              <img
                src={post?.featuredImage?.url || "/images/default.jpeg"}
                alt={post.title}
              />
            }
          >
          {editPost ?(<Input
        size="large"
        value={title}
        placeholder="Give your post a title"
        onChange={(e) => {
          setTitle(e.target.value);
          localStorage.setItem("post-title", JSON.stringify(e.target.value));
        }} />):(<Title>{post.title}</Title>)}
           
           
            <p>
              {dayjs(post.createdAt).format("MMMM D, YYYY h:mm A")} / 0 Comments
              / in{" "}
              {post?.categories.map((c) => (
                <span key={c._id}>
                  <Link href={`/category/${c.slug}`}>
                    <a>{c.name} </a>
                  </Link>
                </span>
              ))}
            </p>

            {/* social share */}
            <div style={{ marginTop: "-20px", marginBottom: "15px" }}>
              <ShareSocial
                url={process.browser && window.location.href}
                socialTypes={["facebook", "twitter", "reddit", "linkedin"]}
                style={{
                  height: "100px",
                  overflow: "hidden",
                  background: "none",
                }}
              />
            </div>
            {/* Share this blog content on twitter*/}
            <button onClick={() => {
              window.open(`https://twitter.com/intent/tweet?text=${post.content}&url=${process.browser && window.location.href}&hashtags=${post.categories.map((c) => (c.name))}`, '_blank');
            }}>Share on Twitter</button>
            
            {editPost ? (
                <Editor
              dark={theme === "light" ? false : true}
              defaultValue={content}
              onChange={(v) => {
                setContent(v());
                localStorage.setItem("post-content", JSON.stringify(v()));
              }}
              
            />):( <Editor
              defaultValue={post.content}
              dark={theme === "light" ? false : true}
              readOnly={true}
            />)}
           {!editPost ? (<button  className="btn btn-primary" onClick={setEditPost}>edit post</button>):(<button  className="btn btn-primary" onClick={updatePost}>update post</button>)}     
                     <CommentForm
              comment={comment}
              setComment={setComment}
              handleSubmit={handleSubmit}
              loading={loading}
            />

            <div style={{ marginBottom: 50 }}></div>

            <List
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={(item) => (
                <List.Item key={item._id} id={item._id}>
                  <List.Item.Meta
                    avatar={<Avatar>{item?.postedBy?.name?.charAt(0)}</Avatar>}
                    title={item?.postedBy?.name}
                    description={`${item.content} - ${dayjs(
                      item.createdAt
                    ).fromNow()}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={22} xl={6} offset={1}>
          <Divider>Categories</Divider>

          {categories.map((c) => (
            <Link href={`/category/${c.slug}`} key={c._id}>
              <a>
                <Button style={{ margin: 2 }}>{c.name}</Button>
              </a>
            </Link>
          ))}

          <Divider>Latest Posts</Divider>
          {latestPosts.map((p) => (
            <Link href={`/post/${p.slug}`} key={p._id}>
              <a>
                <h4>{p.title}</h4>
              </a>
            </Link>
          ))}
        </Col>
      </Row>


      
    </>
  );
};

export async function getServerSideProps({ params }) {
  const { data } = await axios.get(`${process.env.API}/post/${params.slug}`);
  return {
    props: {
      post: data.post,
      postComments: data.comments,
    },
  };
}

export default SinglePost;

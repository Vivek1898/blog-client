import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Row, Col, Card, Avatar, Button as button, Input } from "antd";
import Head from "next/head";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AuthContext } from "../context/auth";
const { Meta } = Card;

export const Posts = ({ posts }) => {
  const [auth, setAuth] = useContext(AuthContext);
  // state
  const [allPosts, setAllPosts] = useState(posts);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [Likes, setLikes] = useState("");
  const [postIdd, setpostId] = useState("");
  const [flag, setFlag] = useState(false);
  //Search

  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/post-count");
      console.log("total", data);
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  const UpdateLike = async (ee) => {
    try {
      // setpostId(ee);
      setLikes("");
      const postId = ee;
      console.log(postId);
      const { data } = await axios.post("/likes", { postId });
      console.log("total", data);

      setLikes(data.likes);
      setFlag(true);
      LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };

  const DisLike = async (ee) => {
    try {
      const postId = ee;
      console.log(postId);
      const { data } = await axios.post("/disLikes", { postId });
      console.log("total", data);
      setLikes(data.likes);
      setFlag(false);
      LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/posts/${page}`);
      setAllPosts([...allPosts, ...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const LikeHelper = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/posts/${page}`);
      setAllPosts([...data]);
      setLoading(false);
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

  const fav = async (ee, pt, pl) => {
    try {
      console.log(auth.user.favourites);
      const userId = auth.user._id;
      const postId = ee;
      const postTitle = pt;
      const postLikes = pl;
      console.log(postId);
      const { data } = await axios.post("/addtofav", {
        postTitle,
        postLikes,
        postId,
        userId,
      });
      console.log("Added To Favorites", data);
      // setLikes(data.likes);
      // setFlag(false)
      // LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Head>
      
        <title>Recent blog posts</title>
        <meta description="Blog posts about web development, programming etc" />
      </Head>
      <Input
        placeholder="Search..."
        onChange={(e) => searchItems(e.target.value)}
      />

      {searchInput.length > 1 ? (
        <Row gutter={12}>
          {filteredResults.map((post) => (
            <Col xs={24} xl={8} style={{ marginTop: 5, marginBottom: 5 }}>
              <Link href={`/post/${post.slug}`}>
                <a>
                  <Card
                    hoverable
                    cover={
                      <Avatar
                        shape="square"
                        style={{ height: "200px" }}
                        src={post.featuredImage?.url || "images/default.jpeg"}
                        alt={post.title}
                      />
                    }
                  >
                    <p>{post.likes}</p>
                 
                  </Card>
                </a>
              </Link>

              {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
              {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
              <button onClick={() => UpdateLike(post._id)}>Likes</button>
              <button onClick={() => DisLike(post._id)}>DisLikes</button>

              {auth?.user !== null && (
                <button onClick={fav(post._id)}>Add to Fav</button>
              )}
              <CopyToClipboard
                text={"http://localhost:3000/post/" + post.slug}
              >
                <button>Copy URL to the clipboard</button>
              </CopyToClipboard>
              <Meta title={post.title} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={12}>
          {allPosts.map((post) => (
            <Col xs={24} xl={8} style={{ marginTop: 5, marginBottom: 5 }}>
              {/* <Link href={`/post/${post.slug}`}>
              <a>
                <Card
                  hoverable
                  cover={
                    <Avatar
                      shape="square"
                      style={{ height: "200px" }}
                      src={post.featuredImage?.url || "images/default.jpeg"}
                      alt={post.title}
                    />
                  }
                >
                   <p>{post.likes}</p>                    
                </Card>
              </a>
           </Link> */}
           <Link href={`/post/${post.slug}`}>
              <div class="flex justify-center">
                <div class="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
                  <img
                    class=" w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg"
                    src={post.featuredImage?.url || "images/default.jpeg"}
                    alt=""
                  />
                  <div class="p-6 flex flex-col justify-start">
                    <h5 class="text-gray-900 text-xl font-medium mb-2">
                      {post.title}
                    </h5>
                    <p class="text-gray-700 text-base mb-4">{post.content}</p>
                    <p class="text-gray-700 text-base mb-4">{post.likes}</p>
                    <p class="text-gray-600 text-xs">Last updated 3 mins ago</p>
                    <div className="flex">
                    <button onClick={() => UpdateLike(post._id)} class=" m-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded inline-flex items-center">
                      <svg
                        class="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                      <span>Like</span>
                    </button>
                    <button  onClick={() => DisLike(post._id)} class="m-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 rounded inline-flex items-center">
                      <svg
                        class="fill-current w-4 h-4 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                      </svg>
                      <span>Dislike</span>
                    </button>
                    {auth && (
                <button onClick={() => fav(post._id, post.title, post.likes)}>
                  Add to Fav
                </button>
              )}
                    </div>
                  </div>
                </div>
              </div>

</Link>
              {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
              {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
              <CopyToClipboard
                text={"http://localhost:3000/post/" + post.slug}
              >
                <button>Copy URL to the clipboard</button>
              </CopyToClipboard>
              {/* <button onClick={Dislike}>Dislikes</button> */}
            </Col>
          ))}
        </Row>
      )}

      {allPosts?.length < total && (
        <Row>
          <Col span={24} style={{ textAlign: "center", padding: 20 }}>
            <Button
              size="large"
              type="primary"
              loading={loading}
              onClick={() => setPage(page + 1)}
            >
              Load More
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/posts/1`);
  return {
    props: {
      posts: data,
    },
  };
}

export default Posts;

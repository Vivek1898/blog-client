import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { Row, Col, Card, Avatar, Button, Input } from "antd";
import Head from "next/head";
import Link from "next/link";
import { AuthContext } from "../context/auth";
const { Meta } = Card;

export const Posts = ({ posts }) => {

  const [auth, setAuth] = useContext(AuthContext);
  // state
  const [allPosts, setAllPosts] = useState(posts);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const[Likes,setLikes]=useState("");
  const[postIdd,setpostId]=useState("");
  const[Favorites,setFavorites]=useState([]);
  const[flag,setFlag]=useState(false);
//Search

const [filteredResults, setFilteredResults] = useState([]);
const [searchInput, setSearchInput] = useState('');



  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
        console.log("Helloi")
        console.log(auth)
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
       const postId=ee;
     console.log(postId)
      const { data } = await axios.post("/likes",{postId});
      console.log("total", data);
      
      setLikes(data.likes);
      setFlag(true)
      LikeHelper();
      
      
      
    } catch (err) {
      console.log(err);
    }
  };

  const DisLike = async (ee) => {
    try {
      const postId=ee;
     console.log(postId)
      const { data } = await axios.post("/disLikes",{postId});
      console.log("total", data);
      setLikes(data.likes);
      setFlag(false)
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
 
    setSearchInput(searchValue)
    if (searchInput !== '') {
        const filteredData = allPosts.filter((item) => {
            return item.title.toLowerCase().includes(searchInput.toLowerCase())
        })
        setFilteredResults(filteredData)
    }
    else{
        setFilteredResults(allPosts)
    }
}

const fav = async (ee,pt,pl,) => {
  try {
  console.log(auth.user._id)
    const userId=auth.user._id
    const postId=ee;
    const postTitle=pt;
    const postLikes=pl;
   console.log(postId)
    const { data } = await axios.post("/addtofav",{postTitle,postLikes,postId,userId});
    console.log("Added To Favorites", data);
    // setLikes(data.likes);
    // setFlag(false)
    // LikeHelper();
   
  } catch (err) {
    console.log(err);
  }
};

const loadData = async () =>{
    try {
        console.log(auth.user.favourites)

        setFavorites(auth.user.favourites);
        LikeHelper();

        // const userId=auth.user._id
      
        // const { data } = await axios.post("/getAllFav",{userId});
        // console.log("SA")

        // for(const ele of data){
        //     console.log(ele.favourites.postId)
        // }
       // console.log(data.favourites)
      

        return;
        // data.forEach(element => {
        //     console.log(element.title)
        // });
        
        setFavorites(data);
        
    } catch (error) {
    console.log(error)       
    }
}

useEffect(() => {
    loadData();
  }, []);



  return (
    <>
      <Head>
        <title>Recent blog posts</title>
        <meta description="Blog posts about web development, programming etc" />
      </Head>
      <Input 
                placeholder='Search...'
                onChange={(e) => searchItems(e.target.value)}
            />
<button onClick={()=> loadData()}>DisLikes</button>

{searchInput.length>1 ? ( <Row gutter={12}>
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
                    {/* if(page==1){
                      <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                    }
                    else{
                      <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                    } */}
                     
                </Card>
              </a>
        </Link>

        {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
        {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
        <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                     <button onClick={()=> DisLike(post._id)}>DisLikes</button>
        

        {user && <button onClick={fav(post._id)}>Add to Fav</button> }
                    
                  <Meta title={post.title} />
          </Col>
        ))}
      </Row>):( <Row gutter={12}>
        {Favorites.map((post) => (
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
                    {/* if(page==1){
                      <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                    }
                    else{
                      <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                    } */}
                     
                </Card>
              </a>
        </Link>

        {/* {!flag ? (<button onClick={()=> UpdateLike(post._id)}>Likes</button>):(<button onClick={()=> DisLike(post._id)}>DisLikes</button>)} */}
        {/* {flag &&  <button onClick={()=> UpdateLike(post._id)}>Likes</button>}
        {!flag && <button onClick={()=> DisLike(post._id)}>DisLikes</button>} */}
        <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                     <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                     {auth && <button onClick={()=>fav(post._id,post.title,post.likes)}>Add to Fav</button> }
                     {/* <button onClick={Dislike}>Dislikes</button> */}
                  <Meta title={post.title} />
          </Col>
        ))}
      </Row>)}
     

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
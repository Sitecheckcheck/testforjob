import "./App.css";
import React, { useEffect, useState } from "react";
import { getProducts } from "./functions/getProducts";
import { getFilterProducts } from "./functions/getFilterProducts";

function App() {
  const [products, setProducts] = useState();
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [isloading, setIsloading] = useState(true);
  const [input, setInput] = useState();
  const [countPages, setCountPages] = useState(50);
  const [isFilter, setIsFilter] = useState(null);
  const [method, setMethod] = useState(null);
  const [allProducts, setAllProducts] = useState();

  const handleFind = async (method, count) => {
    setMethod(method);
    setPage(1);
    setIsloading(true);
    setIsFilter("filter");
    let obj = {};
    if (method === "price") {
      obj[method] = Number(input);
    } else {
      obj[method] = input;
    }

    const data = await getFilterProducts(obj, count, setAllProducts);
    setProducts(data);
    setIsloading(false);
  };

  const handlePrev = async (method, count) => {
    if (isFilter === "filter") {
      if (countPages > 50) {
        setIsloading(true);
        try {
          await handleFind(method, count - 50);
          setCountPages(count - 50);
          setPage(page - 1);
        } catch (error) {
          console.log(error);
        } finally {
          setIsloading(false);
        }
      }
    } else {
      if (offset > 50) {
        setIsloading(true);
        try {
          const data = await getProducts(offset - 50);
          setProducts(data);
          setOffset(offset - 50);
          setPage(page - 1);
        } catch (error) {
          console.log(error);
        } finally {
          setIsloading(false);
        }
      }
    }
  };

  const handleNext = async (method, count) => {
    if (isFilter === "filter") {
      if (allProducts - countPages > 0) {
        setIsloading(true);
        try {
          await handleFind(method, count + 50);
          setCountPages(count + 50);
          setPage(page + 1);
        } catch (error) {
          console.log(error);
        } finally {
          setIsloading(false);
        }
      }
    } else {
      setIsloading(true);
      try {
        const data = await getProducts(offset + 50);
        setProducts(data);
        setOffset(offset + 50);
        setPage(page + 1);
      } catch (error) {
        console.log(error);
      } finally {
        setIsloading(false);
      }
    }
  };

  useEffect(() => {
    setIsloading(true);
    try {
      getProducts(0).then((data) => {
        setProducts(data);
        setIsloading(false);
      });
    } catch (error) {
      console.log(error);
      setIsloading(false);
    }
  }, []);

  return (
    <div className="App">
      {isloading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div>
            <p>искать:</p>
            <input onChange={(e) => setInput(e.target.value)}></input>
            <div>
              <button
                onClick={() => {
                  handleFind("product", 50);
                }}
              >
                в названии
              </button>
              <button
                onClick={() => {
                  handleFind("price", 50);
                }}
              >
                в цене
              </button>
              <button
                onClick={() => {
                  handleFind("brand", 50);
                }}
              >
                в бренде
              </button>
            </div>
          </div>
          {products?.length === 0 ? (
            <p className="notFound">не найдено</p>
          ) : (
            products?.map((el) => (
              <div key={el.id} className="block">
                <p>{el.id}</p>
                <p>{el.product}</p>
                <p>{el.price}</p>
                <p>{el.brand}</p>
              </div>
            ))
          )}
          <div className="pagination">
            <button onClick={() => handlePrev(method, countPages)}>prev</button>
            <p>{page}</p>
            <button onClick={() => handleNext(method, countPages)}>next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

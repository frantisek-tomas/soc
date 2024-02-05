import Navbar from "../commonest/navbar/navbar";
import Footer from "../commonest/footer/footer";
import "../prices/prices.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMedicalProcedures } from "../commonest/features/priceSlice";

const Prices = () => {
  const prices = useSelector(({ prices }) => prices.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMedicalProcedures());
  }, [dispatch]);
  return (
    <>
      <Navbar />
      <div className="div-prices">
        <h1 className="h1-prices">
          Cenník výkonov nehradených zdravotnou poisťovňou
        </h1>
        <div className="prices-list">
          {prices.map((data) => (
            <div key={data.id} className="tablediv">
              <h2 className="div-h2-table">{data.name}</h2>
              <table className="div-table">
                <tbody className="tbody-table">
                  {data.medicalProcedures.map((tableData, index) => (
                    <tr className="row-table" key={index} name={data.id}>
                      <td className="name-table">{tableData.name}</td>
                      <td className="price-table">{tableData.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Prices;

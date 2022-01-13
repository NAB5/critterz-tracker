import { Formik, Field, Form, FormikHelpers } from "formik";
import { useState } from "react";
import Router from "next/router";
import { FaSearch, FaCircleNotch } from "react-icons/fa";
import web3 from "web3-utils";

interface Values {
  wallet: string;
}

function convertAddressToChecksum(address: string) {
  const checksumAddress = web3.toChecksumAddress(address);

  if (!web3.checkAddressChecksum(checksumAddress)) {
    throw Error("invalid checksum address");
  }

  return checksumAddress;
}

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`p-3 border bg-darkgreen border-gray-700 ${
        error ? "border-red : " : ""
      } ${loading ? "opacity-20 animate-pulse" : ""}`}
    >
      <Formik
        initialValues={{
          wallet: "",
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          try {
            const wallet = convertAddressToChecksum(values.wallet);
          } catch (e) {
            setError(true);
            return;
          }
          setError(false);
          setSubmitting(false);
          setLoading(true);
          Router.push(`/${values.wallet}`);
        }}
      >
        <Form className="flex justify-between autofill:bg-darkgreen">
          <Field
            className="bg-transparent w-5/6 outline-none autofill:bg-darkgreen"
            id="wallet"
            name="wallet"
            autoComplete="off"
            spellCheck="false"
            placeholder={placeholder}
          />
          <button type="submit">
            {" "}
            {!loading && <FaSearch />}
            {loading && <FaCircleNotch className="animate-spin" />}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default SearchBar;

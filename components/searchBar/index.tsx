import { Formik, Field, Form, FormikHelpers } from "formik";
import Router, { useRouter } from "next/router";
import { FaSearch } from "react-icons/fa";

interface Values {
  wallet: string;
}

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="p-3 border bg-darkgreen border-gray-700">
      <Formik
        initialValues={{
          wallet: "",
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          //   setSubmitting(false);
          // }, 500);
          Router.push(`/${values.wallet}`);
        }}
      >
        <Form className="flex justify-between">
          <Field
            className="bg-transparent w-5/6 outline-none"
            id="wallet"
            name="wallet"
            placeholder={placeholder}
          />
          <button type="submit">
            {" "}
            <FaSearch />
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default SearchBar;

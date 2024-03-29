import { Button, Checkbox, ErrorMessage, Input, Select } from "@/atoms";
import { createItem, updateItem } from "@/firebase/actions";
import { IItemData, ItemDataDefault } from "@/types/item.interface";
import { useFormik } from "formik";
import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { IoMdSend } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const ItemForm: React.FunctionComponent<IItemFormProp> = ({
  label,
  isEditing = false,
  itemData = ItemDataDefault,
  loading = false,
  error = "",
}: IItemFormProp) => {
  const navigate = useNavigate();
  const [option, setOption] = useState<string>("");
  const categoryOptions = ["Cake", "Pie", "Fried"];

  const validationObject = {
    name: Yup.string().required("Name is required"),
    category: Yup.string().required("Category is required"),
    cost: Yup.number()
      .required("Cost is required")
      .moreThan(0, "Must be more than zero"),
    price: Yup.number()
      .required("Cost is required")
      .moreThan(0, "Must be more than zero"),
    stock: Yup.number(),
    withOptions: Yup.boolean(),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: itemData.name,
      category: itemData.category,
      cost: itemData.cost,
      price: itemData.price,
      stock: itemData.stock,
      withOptions: itemData.withOptions,
      options: itemData.options ? itemData.options.split(",") : [],
    },
    validationSchema: Yup.object(validationObject),
    onSubmit: (values, form) => {
      const serializeValues = {
        ...values,
        withOptions: values.options.length === 0 ? false : values.withOptions,
        options: values.options.join(),
        stock: Math.trunc(Number(values.stock)),
      };

      // clear/reset unwanted values
      form.setFieldValue("stock", serializeValues.stock);
      if (option) setOption("");
      if (!serializeValues.withOptions)
        form.setFieldValue("withOptions", false);

      if (!isEditing) {
        createItem(serializeValues, form.setSubmitting, navigate);
        return;
      }
      updateItem({ ...serializeValues, id: itemData.id }, formik.setSubmitting);
    },
  });

  const addToOptions = (): void => {
    if (!option) return;
    const newOptionValue = [...formik.values.options, option.replace(/,/g, "")];
    // make the list always unique to avoid duplicate option item
    const makeOptionsUnique: Set<string> = new Set(newOptionValue);
    formik.setFieldValue("options", Array.from(makeOptionsUnique));
    setOption("");
  };

  const removeOption = (option: string): void => {
    formik.setFieldValue(
      "options",
      formik.values.options.filter((opt) => opt !== option),
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-semibold text-secondary">{label}</h2>
        {(loading || formik.isSubmitting) && !error && (
          <ImSpinner8 className="animate-spin text-3xl text-secondary" />
        )}
      </div>
      {error && <ErrorMessage message={error} />}
      <form
        className="flex flex-col gap-7"
        onSubmit={(event) => {
          event.preventDefault();
          formik.handleSubmit();
          return false;
        }}
      >
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Input
            name="name"
            label="Name"
            required={!validationObject.name.spec.optional}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && formik.errors.name}
            disabled={loading || formik.isSubmitting}
          />
          <Select
            name="category"
            required={!validationObject.category.spec.optional}
            value={formik.values.category}
            label="Category"
            options={categoryOptions}
            onChange={formik.handleChange}
            error={formik.touched.category && formik.errors.category}
            disabled={loading || formik.isSubmitting}
          />
          <Input
            name="cost"
            label="Cost"
            required={!validationObject.cost.spec.optional}
            value={formik.values.cost}
            type="number"
            placeholder="0.00"
            onChange={formik.handleChange}
            error={formik.touched.cost && formik.errors.cost}
            disabled={loading || formik.isSubmitting}
          />
          <Input
            name="price"
            label="Price"
            required={!validationObject.price.spec.optional}
            value={formik.values.price}
            type="number"
            placeholder="0.00"
            onChange={formik.handleChange}
            error={formik.touched.price && formik.errors.price}
            disabled={loading || formik.isSubmitting}
          />
          <Input
            name="stock"
            label="Stock"
            required={!validationObject.stock.spec.optional}
            value={formik.values.stock}
            type="number"
            placeholder="0"
            onChange={formik.handleChange}
            error={formik.touched.stock && formik.errors.stock}
            disabled={loading || formik.isSubmitting}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Checkbox
            name="withOptions"
            label="With Options?"
            disabled={loading}
            checked={formik.values.withOptions}
            onChange={formik.handleChange}
          />
          {formik.values.withOptions && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 lg:max-w-sm">
                <Input
                  value={option}
                  placeholder="Option"
                  onChange={(event) => setOption(event.target.value)}
                />
                <button
                  onClick={() => addToOptions()}
                  className="h-12 rounded-lg bg-primary px-3"
                  type="button"
                >
                  <LuPlus className="text-2xl text-white" />
                </button>
              </div>
              {formik.values.options.map((option: string, idx: number) => (
                <div key={idx} className="flex gap-4 lg:max-w-sm">
                  <Input
                    name={`options[${idx}]`}
                    onChange={formik.handleChange}
                    value={option}
                    disabled={loading || formik.isSubmitting}
                  />
                  <button
                    onClick={() => removeOption(option)}
                    className="h-12 rounded-lg bg-red-600 px-3"
                    type="button"
                  >
                    <FaRegTrashAlt className="text-2xl text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Button type="submit" disabled={loading || formik.isSubmitting}>
            <div className="flex items-center gap-2">
              <IoMdSend className="text-lg" />
              {isEditing ? "Update" : "Save"}
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemForm;

interface IItemFormProp {
  label: string;
  isEditing?: boolean;
  itemData?: IItemData;
  loading?: boolean;
  error?: string;
}

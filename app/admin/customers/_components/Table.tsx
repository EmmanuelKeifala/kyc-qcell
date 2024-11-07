"use client";
import React, { useRef, useState } from "react";
import {
  SearchOutlined,
  DownOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Dropdown, Menu, message } from "antd";
import type { InputRef, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { DataType } from "@/types";
import { UpdateCustomerStatus } from "@/actions/update-customer-status";
import * as XLSX from "xlsx";
import { Button as ShadButton } from "@/components/ui/button";

type DataIndex = keyof DataType;

const CustomerTable: React.FC<{ data: DataType[] }> = ({ data }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const [verificationData, setVerificationData] = useState<any[]>(data);
  const searchInput = useRef<InputRef>(null);

  const handleExport = () => {
    // Prepare data for export
    const exportData = verificationData.map((item) => ({
      "Phone Number": item.phoneNumber,
      Status: item.verificationStatus,
      "First Name": item.metadata.firstName,
      "Middle Name": item.metadata.middleName,
      "Date of Birth": item.metadata.dateOfBirth,
      "Personal ID": item.metadata.personalIdNumber,
      "Selfie URL": item.selfieUrl,
      "ID Card URL": item.idCardUrl,
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Data");

    // Generate file name with current date
    const date = new Date().toISOString().split("T")[0];
    const fileName = `customer_data_${date}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
    message.success("Export successful!");
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Handle status change
  const handleStatusChange = async (status: string, record: DataType) => {
    const updatedData = verificationData.map((item) =>
      item.phoneNumber === record.phoneNumber
        ? { ...item, verificationStatus: status }
        : item
    );
    setVerificationData(updatedData);
    message.success(`Status updated to "${status}"`);

    const data = await UpdateCustomerStatus({
      phoneNumber: record.phoneNumber,
      status: status,
    });
  };

  const columns: Array<TableColumnType<DataType>> = [
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "Status",
      dataIndex: "verificationStatus",
      key: "verificationStatus",
      ...getColumnSearchProps("verificationStatus"),
      sorter: (a, b) =>
        a.verificationStatus.localeCompare(b.verificationStatus),
    },
    {
      title: "Personal Data",
      dataIndex: "metadata",
      key: "metadata",
      render: (metadata) => (
        <div>
          <p>
            <strong>First Name:</strong> {metadata.firstName}
          </p>
          <p>
            <strong>Middle Name:</strong> {metadata.middleName}
          </p>
          <p>
            <strong>Date of Birth:</strong> {metadata.dateOfBirth}
          </p>
          <p>
            <strong>Personal ID:</strong> {metadata.personalIdNumber}
          </p>
        </div>
      ),
    },
    {
      title: "Selfie URL",
      dataIndex: "selfieUrl",
      key: "selfieUrl",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          View
        </a>
      ),
    },
    {
      title: "ID Card URL",
      dataIndex: "idCardUrl",
      key: "idCardUrl",
      render: (url) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          View
        </a>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              onClick={(e) => handleStatusChange(e.key, record)}
              items={[
                { label: "Verified", key: "verified" },
                { label: "Requires Visit", key: "requires visit" },
                { label: "Pending", key: "pending" },
                { label: "Flagged", key: "flagged" },
              ]}
            />
          }
        >
          <Button>
            Update Status <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16 }} className="flex items-end justify-end">
        <ShadButton onClick={handleExport} className="bg-[#F78F1E]">
          <p className="text-white font-semibold">Export to Excel</p>
          <DownloadOutlined />
        </ShadButton>
      </div>
      <Table
        columns={columns}
        dataSource={verificationData}
        rowKey="phoneNumber"
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default CustomerTable;

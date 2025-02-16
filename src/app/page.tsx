"use client";

import type React from "react";
import { useState } from "react";
import {
  Folder,
  File as FileIcon,
  Upload,
  LayoutGrid,
  LayoutList,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Button } from "~/components/ui/button";

type FileType =
  | "document"
  | "spreadsheet"
  | "image"
  | "audio"
  | "video"
  | "pdf";

type FileItem = {
  id: string;
  name: string;
  type: FileType;
  url?: string;
  parent: string;
  size: number;
};

type FolderItem = {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
  children?: DriveItem[];
};

export type DriveItem = FileItem | FolderItem;

const mockData: DriveItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    parent: null,
    children: [
      {
        id: "2",
        name: "Report.docx",
        type: "document",
        parent: "1",
        size: 2500000,
      },
      {
        id: "3",
        name: "Spreadsheet.xlsx",
        type: "spreadsheet",
        parent: "1",
        size: 1800000,
      },
    ],
  },
  {
    id: "4",
    name: "Images",
    type: "folder",
    parent: null,
    children: [
      {
        id: "5",
        name: "Vacation.jpg",
        type: "image",
        parent: "4",
        size: 4200000,
      },
      {
        id: "6",
        name: "Family.png",
        type: "image",
        parent: "4",
        size: 3100000,
      },
    ],
  },
  {
    id: "7",
    name: "Music.mp3",
    type: "audio",
    parent: "",
    size: 8500000,
  },
  {
    id: "8",
    name: "Video.mp4",
    type: "video",
    parent: "",
    size: 95000000,
  },
  {
    id: "9",
    name: "Document.pdf",
    type: "pdf",
    parent: "",
    size: 1200000,
  },
];

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "—";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getItemIcon = (type: "folder" | FileType) => {
  switch (type) {
    case "folder":
      return <Folder className="h-6 w-6 text-gray-400" />;
    case "document":
      return <FileIcon className="h-6 w-6 text-blue-400" />;
    case "spreadsheet":
      return <FileIcon className="h-6 w-6 text-green-400" />;
    case "image":
      return <FileIcon className="h-6 w-6 text-yellow-400" />;
    case "audio":
      return <FileIcon className="h-6 w-6 text-purple-400" />;
    case "video":
      return <FileIcon className="h-6 w-6 text-red-400" />;
    case "pdf":
      return <FileIcon className="h-6 w-6 text-orange-400" />;
    default:
      return <FileIcon className="h-6 w-6 text-gray-400" />;
  }
};

export default function GoogleDriveClone() {
  const [currentFolder, setCurrentFolder] = useState<DriveItem[]>(mockData);
  const [breadcrumbs, setBreadcrumbs] = useState<DriveItem[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleItemClick = (item: DriveItem) => {
    if (item.type === "folder") {
      setBreadcrumbs([...breadcrumbs, item]);
      setCurrentFolder(item.children ?? []);
    } else {
      console.log(`Opening file: ${item.name}`);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentFolder(mockData);
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index);
      setBreadcrumbs(newBreadcrumbs);

      const lastItem = newBreadcrumbs[newBreadcrumbs.length - 1];
      if (lastItem && lastItem.type === "folder") {
        setCurrentFolder(lastItem.children ?? []);
      } else {
        setCurrentFolder([]);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent, item: DriveItem) => {
    e.stopPropagation();
    console.log(`Deleting ${item.type}: ${item.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans text-gray-300">
      <div className="container mx-auto p-6">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              className="hover:bg-gray-800"
              onClick={() => handleBreadcrumbClick(0)}
            >
              M-Drive
            </Button>
            {breadcrumbs.map((item: DriveItem, index: number) => (
              <div key={item.id} className="flex items-center">
                <ChevronRight className="mx-1 h-4 w-4 text-gray-500" />
                <Button
                  variant="ghost"
                  className="hover:bg-gray-800"
                  onClick={() => handleBreadcrumbClick(index + 1)}
                >
                  {item.name}
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hover:bg-gray-800"
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            >
              {viewMode === "list" ? (
                <LayoutGrid className="h-5 w-5" />
              ) : (
                <LayoutList className="h-5 w-5" />
              )}
            </Button>
            <Button className="bg-gray-700 text-white hover:bg-gray-600">
              <Upload className="mr-2 h-5 w-5" />
              Upload
            </Button>
          </div>
        </header>
        <main
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : "space-y-2"
          }
        >
          {currentFolder.map((item: DriveItem) => (
            <div
              key={item.id}
              className={`group cursor-pointer rounded-lg bg-gray-800 transition-colors duration-200 hover:bg-gray-700 ${
                viewMode === "list"
                  ? "flex items-center p-4"
                  : "flex flex-col p-4"
              }`}
              onClick={() => handleItemClick(item)}
            >
              <div
                className={`flex items-center ${
                  viewMode === "list" ? "w-full" : "flex-col"
                }`}
              >
                <div className={viewMode === "list" ? "mr-4" : "mb-3"}>
                  {getItemIcon(item.type)}
                </div>
                <div
                  className={`flex-grow ${
                    viewMode === "grid" ? "mt-2 text-center" : ""
                  }`}
                >
                  <span className="block text-sm font-medium">{item.name}</span>
                  <span className="block text-xs text-gray-400">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}{" "}
                    {item.type !== "folder" ? `• ${formatSize(item.size)}` : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                    viewMode === "list" ? "ml-2" : "mt-2"
                  }`}
                  onClick={(e) => handleDelete(e, item)}
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  <span className="sr-only">Delete {item.name}</span>
                </Button>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

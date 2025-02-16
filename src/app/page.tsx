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

export type FileItem = {
  id: string;
  name: string;
  type: FileType;
  url: string;
  parent: string;
  size: number;
};

export type FolderItem = {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
};

export type DriveItem = FolderItem | FileItem;

const mockFolders: FolderItem[] = [
  {
    id: "root",
    name: "root",
    type: "folder",
    parent: null,
  },
  {
    id: "1",
    name: "Documents",
    type: "folder",
    parent: "root",
  },
  {
    id: "2",
    name: "Images",
    type: "folder",
    parent: "root",
  },
];

const mockFiles: FileItem[] = [
  {
    id: "3",
    name: "Report.docx",
    type: "document",
    parent: "1",
    size: 2500000,
    url: "",
  },
  {
    id: "4",
    name: "Spreadsheet.xlsx",
    type: "spreadsheet",
    parent: "1",
    size: 1800000,
    url: "",
  },
  {
    id: "5",
    name: "Vacation.jpg",
    type: "image",
    parent: "2",
    size: 4200000,
    url: "",
  },
  {
    id: "6",
    name: "Family.png",
    type: "image",
    parent: "2",
    size: 3100000,
    url: "",
  },
  {
    id: "7",
    name: "Music.mp3",
    type: "audio",
    parent: "root",
    size: 8500000,
    url: "",
  },
  {
    id: "8",
    name: "Video.mp4",
    type: "video",
    parent: "root",
    size: 95000000,
    url: "",
  },
  {
    id: "9",
    name: "Document.pdf",
    type: "pdf",
    parent: "root",
    size: 1200000,
    url: "",
  },
];

const getFolderItems = (folderId: string): DriveItem[] => {
  const folders = mockFolders.filter((f) => f.parent === folderId);
  const files = mockFiles.filter((f) => f.parent === folderId);
  return [...folders, ...files];
};

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

export default function MDrive() {
  const [currentFolder, setCurrentFolder] = useState<DriveItem[]>(
    getFolderItems("root"),
  );
  const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const handleItemClick = (item: DriveItem) => {
    if (item.type === "folder") {
      if (item.id !== "root") {
        setBreadcrumbs([...breadcrumbs, item]);
      }
      setCurrentFolder(getFolderItems(item.id));
    } else {
      console.log(`Opening file: ${item.name}`);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentFolder(getFolderItems("root"));
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index);
      setBreadcrumbs(newBreadcrumbs);
      const lastFolder = newBreadcrumbs[newBreadcrumbs.length - 1];
      if (lastFolder) {
        setCurrentFolder(getFolderItems(lastFolder.id));
      } else {
        setCurrentFolder(getFolderItems("root"));
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
            {breadcrumbs.map((item, index) => (
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
          {currentFolder.map((item) => (
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

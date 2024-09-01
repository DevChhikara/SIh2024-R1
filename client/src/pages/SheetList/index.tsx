import { Fragment, useEffect, useRef, useState, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuList, MenuButton, Portal, MenuItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Pagination from "@/components/Pagination";
import Avatar from "@/components/Avatar";
import { createSheet, getSheetList, removeSheetById } from "@/services/Sheet";
import { getStaticUrl, debounce } from "@/utils";
import axios from 'axios';
import { SHEET_URL } from "../../services/config";

interface ISheetData {
  id: string;
  title: string;
  content: string;
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const SheetList = () => {
  const [sheets, setSheets] = useState<ISheetList>([]);
  const [pageMeta, setPageMeta] = useState({} as any);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSheetId, setCurrentSheetId] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  let containerRef = useRef<HTMLTableElement>(null);

  const searchParams = new URLSearchParams(location.search);
  let search = searchParams.get("search") || "";
  let page = searchParams.get("page") || 1;

  useEffect(() => {
    getSheetDetails();
  }, [search, page]);

  const getSheetDetails = async () => {
    try {
      let {
        data: {
          data: { sheets, pageMeta },
        },
      } = await getSheetList({ limit: 15, search, page: +page });
      setSheets(sheets);
      setPageMeta(pageMeta);
    } catch (err: any) {
      toast.error(err?.message);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    console.log('create');
    try {
      let {
        data: {
          data: { sheetId },
        },
      } = await createSheet();
      navigate(`/sheet/${sheetId}`);
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handleDeleteDocument = async (sheetId: string) => {
    if (!window.confirm("Are you sure to delete this form?")) return;

    try {
      await removeSheetById(sheetId);
      getSheetDetails();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  const handlePageChange = (page: number) => {
    if (!containerRef.current) return;

    navigate({
      search:
        page !== 0
          ? `?page=${page + 1}${search ? `&search=${search}` : ""}`
          : "",
    });

    containerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToSheet = (sheetId: string, newTab: boolean = false) => {
    let path = `/sheet/${sheetId}`;
    newTab ? window.open(`#${path}`) : navigate(path);
  };

  const handleChange = debounce<ChangeEvent<HTMLInputElement>>(
    ({ target: { value } }) => {
      navigate({ search: value ? `?search=${value}` : "" });
    },
    500
  );

  const addUserToSheet = async (sheetId: string, email: string) => {
    try {
      const response = await axios.post<{ message: string; data: ISheetData }>(
        `${SHEET_URL}/${sheetId}/addUsertoSheet`,
        { email }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("An error occurred while sharing the sheet.");
    }
  };

  const handleShareSheet = async () => {
    if (email) {
      try {
        await addUserToSheet(currentSheetId, email);
        setEmail('');
        setIsModalOpen(false);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      toast.error("Please enter an email address.");
    }
  };

  return (
    <Fragment>
      <div className="sticky h-[var(--header-height)] grid grid-cols-[250px_1fr_75px] place-content-center bg-[white] z-[999] p-[15px] border-b-[#dadce0] border-b border-solid left-0 top-0">
        <div className="flex items-center gap-2">
          <img className="w-12 h-12" src={getStaticUrl("/logo.png")} />
          <span className="font-medium text-[#5f6368] text-xl">
            Sheets
          </span>
        </div>
        <div className="relative flex items-center justify-center">
          <input
            className="h-[45px] max-w-screen-md w-full outline-none bg-[#f1f3f4] border pl-[15px] pr-10 py-0 rounded-lg border-solid border-transparent focus:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)] focus:bg-[rgba(255,255,255,1)]"
            placeholder="Search by title"
            defaultValue={search || ""}
            onChange={handleChange}
          />
          <i className="bx-search relative text-[22px] w-[35px] h-[35px] flex justify-center items-center text-[#606368] text-2xl cursor-pointer rounded-[50%] right-10 hover:bg-[#dadce0]"></i>
        </div>
        {user && <Avatar user={user} logout={logout} />}
      </div>

      {isLoading ? (
        <div>
          <span>Loading...</span>
        </div>
      ) : (
        <Fragment>
          <table
            ref={containerRef}
            className="max-w-[1024px] font-regular w-full mx-auto my-0 border-collapse mt-6"
          >
            <thead>
              <tr>
                <th className="w-[50%] text-left p-3 pl-7">
                  <span>Title</span>
                </th>
                <th className="w-[20%] text-center p-3">
                  <span>Created at</span>
                </th>
                <th className="w-[20%] text-center p-3">
                  <span>Last opened by me</span>
                </th>
                <th className="w-[10%] text-center p-3">
                  <span>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sheets.length === 0 ? (
                <tr>
                  <td className="py-6 text-center" colSpan={4}>
                    No Records Found
                  </td>
                </tr>
              ) : (
                sheets.map(({ title, _id, createdAt, lastOpenedAt }) => {
                  return (
                    <Fragment key={_id}>
                      <tr
                        className="h-14 transition-colors hover:bg-[#E5F4EA] cursor-pointer"
                        onClick={() => navigateToSheet(_id)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-4 font-medium pl-4">
                            <img
                              className="w-6 h-6"
                              src={getStaticUrl("/favicon.ico")}
                            />
                            <span>{title}</span>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <span className="text-gray-500 text-sm">
                            {dayjs
                              .tz(new Date(createdAt), "Asia/Kolkata")
                              .format("MMM D, YYYY")}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="text-gray-500 text-sm">
                            {dayjs
                              .tz(new Date(lastOpenedAt), "Asia/Kolkata")
                              .fromNow()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-center items-center">
                            <Menu>
                              <MenuButton
                                className="w-8 h-8 hover:bg-[#dadce0] rounded-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="bx-dots-vertical-rounded text-2xl text-gray-500"></i>
                              </MenuButton>
                              <Portal>
                                <MenuList>
                                  <MenuItem
                                    className="flex gap-3 items-center"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeleteDocument(_id);
                                    }}
                                  >
                                    <i className="bx-trash text-xl"></i>
                                    <span>Remove</span>
                                  </MenuItem>
                                  <MenuItem
                                    className="flex gap-3 items-center"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      navigateToSheet(_id, true);
                                    }}
                                  >
                                    <i className="bx-link-external text-xl"></i>
                                    <span>Open in new tab</span>
                                  </MenuItem>
                                  <MenuItem
                                    className="flex gap-3 items-center"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setCurrentSheetId(_id);
                                      setIsModalOpen(true);
                                    }}
                                  >
                                    <i className="bx-share text-xl"></i>
                                    <span>Share</span>
                                  </MenuItem>
                                </MenuList>
                              </Portal>
                            </Menu>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
          {pageMeta.totalPages > 1 && (
            <Pagination pageMeta={pageMeta} onPageChange={handlePageChange} />
          )}
        </Fragment>
      )}

      <button
        className="fixed flex items-center justify-center shadow-[0px_2px_10px_rgba(0,0,0,0.3),0px_0px_1px_rgba(0,0,0,0.1),inset_0px_1px_0px_rgba(255,255,255,0.25),inset_0px_-1px_0px_rgba(0,0,0,0.15)] w-14 h-14 bg-white rounded-[50%] border-[none] right-[25px] bottom-[30px]"
        onClick={handleCreateDocument}
      >
        <img className="w-6 h-6" src={getStaticUrl("/plus.svg")} />
      </button>

      {/* Share Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Share Sheet</h3>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={handleShareSheet}
              >
                Share
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SheetList;

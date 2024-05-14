'use client';

import Modal from '@/components/modal';
import CommonContext from '@/context/commonContext';
import {Button} from '@tremor/react';
import React, {useContext, useEffect, useRef, useState} from 'react';
import 'react-calendar/dist/Calendar.css';
// import LiveReservationModal from './_components/modal';

import {Select, TextInput, NumberInput} from '@/components/form';
import {AiOutlineSearch, AiOutlineCloseCircle} from 'react-icons/ai';
import {CommonCode} from '@/API';
import Pagination from '@/components/pagination';
import moment from 'moment';
import utils from '@/libraries/Utils';
import AwsAPI from '@/libraries/AwsAPI';
import { searchLiveReplays } from '@/graphql/queries';

interface SearchParams {
  Limit?: number; // 페이지네이션
  SearchTypeRef?: any; // 검색 조건
  SearchText?: string; // 검색 텍스트
}


function Page() {
  const [limit, setLimit] = useState(10);
  const searchTypeRef = useRef<HTMLSelectElement>(null); // 검색조건
  const textRef = useRef<HTMLInputElement>(null); // 검색텍스트
  const limitRef = useRef<HTMLSelectElement>(null);

  const [selectCategory, setSelectCategory] = useState('');
  const [postList, setPostList] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [searchType, setSearchText] = useState('');
  const [selectedSearchType, setSelectedSearchType] = useState('userName');

  const [typeCodeKr, setTypeCodeKr] = useState<any>({});

  const {siteId, siteCode, adminInfo} = useContext(CommonContext);
  const [searchParams, setSearchParams] = useState<SearchParams>();
  const [showModal, setShowModal] = useState(false);
  const [reservationData, setReservationData] = useState(null);

  const handleDetailView = (data: any) => {
    console.log(data)

    setReservationData(data); 
    setShowModal(true); 
  };

  // 페이징처리 
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLimit = parseInt(e.target.value);
    setLimit(selectedLimit);
    setCurrentPage(1); 
  };

  const toggleAlert = (index: number) => {
    const updatedPostList = [...postList];
    updatedPostList[index].isAlertOpen = !updatedPostList[index].isAlertOpen;
    setPostList(updatedPostList);
  };

  
  // 초기화 > 달력 추가 필요
  const clearForm = () => {
    setSelectCategory('전체');
    setSelectedSearchType('lectureName');
    setSearchText('');
    // Clearing the input fields
    if (searchTypeRef.current) searchTypeRef.current.value = 'lectureName';
    if (textRef.current) textRef.current.value = '';

    searchLiveReplaysLoad(); 

  };

  const searchLiveReplaysLoad = async () => {
    let filterInput: any = {
      _deleted: {ne: true},
    };
  
    if (searchParams?.SearchTypeRef && searchParams?.SearchText) {
      if (searchParams.SearchTypeRef === 'teacherName') {
        filterInput = {
          ...filterInput,
          teachers: {
            elemMatch: {
              teacherName: { wildcard: '*' + searchParams.SearchText + '*' },
            },
          },
        };
      } else {
        filterInput = {
          ...filterInput,
          [searchParams?.SearchTypeRef]: {
            wildcard: '*' + searchParams?.SearchText + '*',
          },
        }; 
      }
    }
    
    console.log('filterInput', filterInput)
  
    const result: any = await AwsAPI.appSyncApi(searchLiveReplays, {
      filter: {
        ...filterInput,
      },
      limit: limit,
      from: limit * (currentPage - 1),
      sort: [
        {field: 'createdAt', direction: 'desc'},
      ],
    });
  
    // 조회 결과를 상태에 반영
    setPostList(result?.data.searchLiveReplays?.items);
    setTotalCount(result?.data.searchLiveReplays?.total);
    console.log(result.data.searchLiveReplays.items)
  };
  

  const searchKey = (e: any) => {
    if (e.keyCode === 13) {
      searchForm();
    }
  };
  
  const searchForm = () => {
    const selectedSearchType = searchTypeRef.current?.value;
    const searchTextValue = textRef.current?.value;
  
    console.log('검색 조건:', selectedSearchType);
    console.log('검색어:', searchTextValue);
  
    setSearchParams({
      Limit: parseInt(limitRef.current!.value),
      SearchTypeRef: selectedSearchType,
      SearchText: searchTextValue,
    });
  
    searchLiveReplaysLoad(); 
  };

  useEffect(() => {
    if (siteId) {
      setCurrentPage(1); 
      searchLiveReplaysLoad();
    }
  }, [siteId, searchParams, currentPage, limit]); 


  return (
    <div className="bg-white p-[2%]">
      <div>
        {/* <div className="flex flex-wrap items-center">
          <div className="flex items-center mb-3">
            <span className="w-35 pr-5">방송일정(시작일~종료일)</span>
            <input
              className="mr-2 py-2 px-3 w-[250px] border border-gray-200 rounded focus:outline-none focus:border-gray-500"
              value={
                startDate && endDate
                  ? `${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(
                      endDate
                    ).format('YYYY-MM-DD')}`
                  : `${moment(new Date()).format('YYYY-MM-DD')} ~ ${moment(
                      new Date()
                    ).format('YYYY-MM-DD')}`
              }
              onClick={handleInputClick}
              readOnly
            />
            {showCalendar && (
              <Calendar
                className="block bg-gray-200 border border-gray-200 rounded focus:outline-none focus:border-gray-500"
                onChange={(date: any) => handleDateChange(date)}
                value={[startDate, endDate]}
                selectRange
              />
            )}
          </div>
          <div className="flex items-center mb-3">
            <span className="w-20 pl-6">분류</span>
            <Select
              className="mr-2 w-[150px]"
              ref={categoryCodeRef}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectCategory(e.target.value);
              }}
            >
              <option value="전체">전체</option>
              <option value="자소서">자소서</option>
              <option value="인적성">인적성</option>
              <option value="NCS">NCS</option>
              <option value="면접">면접</option>
              <option value="취업전략">취업전략</option>
              <option value="한국사">한국사</option>
              <option value="자격증">자격증</option>
            </Select>
          </div>
        </div> */}

        <div className="flex items-center mb-3">
          <Select
            className="mr-2 w-[180px]"
            ref={searchTypeRef}
            value={selectedSearchType}
            >
            <option value="lectureName">강의명</option>
            <option value="teacherName">선생님명</option>
          </Select>
          <TextInput
            className="mr-2 w-[320px]"
            placeholder="검색어"
            ref={textRef}
            onKeyUp={searchKey} 
          />

          <Button className="ml-2" variant="secondary" 
          onClick={searchForm}
          >
            <span className="flex items-center">
              <AiOutlineSearch className="mr-1" />
              <span>조회하기</span>
            </span>
          </Button>
          <Button className="ml-2" variant="secondary" onClick={clearForm}>
            <span className="flex items-center">
              <AiOutlineCloseCircle className="mr-1" />
              <span>초기화</span>
            </span>
          </Button>
        </div>
      </div>

      <div className="my-5 pt-3 border-t-2 border-blue-400">
        <div className="my-3 bg-blue-200 text-blue-500 font-semibold pl-2 rounded py-2">
          * '순서조정'은 [숫자]가 클수록 상위 노출됩니다. (정수만 입력가능)
        </div>
        총 {totalCount}개 ({currentPage}/{Math.ceil(totalCount / limit)}페이지)
      </div>
      <div className="flex mt-3 items-center mb-4 justify-between">
        <div className="flex items-center">
            <Select
            className="w-[80px] h-[50px] mr-1" ref={limitRef} defaultValue={'10'}
            onChange={handleLimitChange}
            >
            <option value="10">10</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
            </Select>
            <span>개의 항목 표시</span>
        </div>
        <Button className="ml-auto" type="button">
            <span className="flex items-center">
            <span>등록하기</span>
            </span>
        </Button>
      </div>
      
      <table className="text-center w-full" style={{borderCollapse: 'collapse'}}>
        <thead>
            <tr className="w-full">
            <th className="px-1 pb-2  pt-2  w-[4%] border border-gray-500">no</th>
            <th className="px-1 pb-2  pt-2  w-[8%] border border-gray-500">순서조정</th>
            <th className="px-1 pb-2  pt-2  w-[20%] border border-gray-500">강의명</th>
            <th className="px-1 pb-2  pt-2  w-[20%] border border-gray-500">영상주소</th>
            <th className="px-1 pb-2  pt-2  w-[8%] border border-gray-500">선생님</th>
            <th className="px-1 pb-2  pt-2  w-[20%] border border-gray-500">썸네일(이미지주소)</th>
            <th className="px-1 pb-2  pt-2  w-[8%] border border-gray-500">준비중 얼럿창</th>
            <th className="px-1 pb-2  pt-2  w-[20%] border border-gray-500">관리</th>
            </tr>
        </thead>
        <tbody className="text-sm">
          {typeCodeKr &&
            postList &&
            postList.map((data: any, index: number) => (
              <tr className="text-center border border-gray-500" key={data.id}>

                <td className="px-1 py-2 border border-gray-500">
                  {totalCount - (currentPage - 1) * limit - index}
                </td>
                <td className="px-1 py-2 border border-gray-500">          
                <NumberInput
                    className="w-[320px]"
                    placeholder="순서"
                    // ref={textRef}
                    // onKeyUp={searchKey} 
                />
                </td>
                <td className="px-1 py-2 border border-gray-500">{data.lectureName}</td>
                <td className="px-1 py-2 border border-gray-500">{data.replayURL}</td>
                <td className="px-1 py-2 border border-gray-500">
                  {data.teachers[0].teacherName}
                </td>

                <td className="px-1 py-2 border border-gray-500">{data.thumbnail}</td>
                <td className="px-1 py-2 border border-gray-500">
                    <button 
                        // onClick={toggleAlert} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {data.isUseReady ? 'true' : 'false'}
                    </button>
                </td>
                <td className="px-1 py-2 border border-gray-500">
                  <Button
                    type="button"
                    className="mr-1"
                    onClick={() => handleDetailView(data)}
                  >
                    수정
                  </Button>
                  <Button
                    type="button"
                    color="red"
                    // onClick={() => deleteBoardTypes(data.id, data._version)}
                    >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        total={totalCount}
        page={currentPage}
        pageSize={limit}
        onChange={setCurrentPage}
      />
       {/* {showModal  && (
        <Modal visible={showModal} onClose={() => setShowModal(false)}>
          <LiveReservationModal
            visible={showModal}
            data={reservationData}
          />
        </Modal>
      )} */}
    </div>
  );
}

export default Page;




// const toggleAlert = () => {
//   setIsAlertOpen(!isAlertOpen);
// };
// <td className="px-1 py-2 border border-gray-500">
//   <button onClick={toggleAlert} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//     {isAlertOpen ? '닫기' : '열기'}
//   </button>
// </td>

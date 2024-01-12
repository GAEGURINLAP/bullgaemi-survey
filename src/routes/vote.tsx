import styled from "@emotion/styled";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { auth, db } from "../firebase";
import { collection, getDocs, query, updateDoc } from "firebase/firestore";

import BottomButton01 from "../component/BottomButon01";
import { IVoteList } from "./vote-register/candidate";
import Alert from "../component/Alert";
import ButtonSecondary from "../component/ButtonSecondary";
import ButtonPrimary from "../component/ButtonPrimary";
import Success from "../component/Success";

const Wrapper = styled.div`
  padding: 0 24px;
  padding-top: 120px;
  height: 100%;
  padding-bottom: 80px;
`;

export const CurrentTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  line-height: 140%;
  b {
    color: red;
  }
`;

export const CurrentVote = styled.div`
  /* margin-top: 48px; */
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const VoteTitle = styled.h2`
  text-align: center;
  font-size: 24px;
`;

export const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 8px;
`;
export const VoteItem = styled.div<VoteItemProps>`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-use-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
  display: flex;
  padding: 4px 16px;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  line-height: 32px;
  color: ${({ isSelected }) => (isSelected ? "var(--white)" : "var(--black)")};
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--main)" : "#ededed"};
  border-radius: 100px;
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover,
  :active {
    color: var(--white);
    background-color: var(--main);
  }
`;

interface VoteItemProps {
  isSelected: boolean;
}

export interface IVote {
  user_id: string;
  user_name: string;
  vote_id: number;
  vote_list: IVoteList[];
  vote_name: string;
  total_votes_cnt: number;
  available_votes_cnt: number;
  already_voters: string[];
  is_complete: boolean;
  create_at: Date;
  id: string;
}

export default function Vote() {
  const [vote, setVote] = useState<IVote>();
  // const [successMessege, isSuccessMessege] = useState('');

  const [isShowAlertVote, setShowAlertVote] = useState(false);
  const [isShowAlertConfirm, setShowAlertConfirm] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  const { id } = useParams();

  const navigate = useNavigate();

  const user = auth.currentUser;

  const fetchVotes = async () => {
    const q = query(collection(db, "vote"));
    console.log("q??", q);

    const snapshot = await getDocs(q);

    const votes = snapshot.docs.map((doc) => {
      const {
        user_id,
        user_name,
        vote_id,
        vote_list,
        vote_name,
        total_votes_cnt,
        available_votes_cnt,
        already_voters,
        is_complete,
        create_at,
      } = doc.data();
      return {
        user_id,
        user_name,
        vote_id,
        vote_list,
        vote_name,
        total_votes_cnt,
        available_votes_cnt,
        already_voters,
        is_complete,
        create_at,
        id: doc.id,
      };
    });
    const newVote = votes.find((vote) => vote.vote_id == id);

    if (!newVote) {
      navigate("/not-found");
    }

    setVote(newVote);
  };

  console.log("vote??", vote);

  const clickVote = () => {
    setShowAlertVote(true);
  };

  // const clickVoteConfirm = () => {
  //   setShowAlertConfirm(true);
  // };

  const onRegister = async () => {
    if (selectedItemIndex !== null) {
      const selectedList = vote?.vote_list[selectedItemIndex];

      let VotesCnt = selectedList?.votes_cnt || 0;
      let TotalVotesCnt = vote?.total_votes_cnt || 0;
      let AvailableVotesCnt = vote?.available_votes_cnt || 0;

      VotesCnt += 1;
      TotalVotesCnt += 1;
      AvailableVotesCnt -= 1;

      const q = query(collection(db, "vote"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const voteDocRef = querySnapshot.docs[0].ref;

        await updateDoc(voteDocRef, {
          vote_list: vote?.vote_list.map((item, index) =>
            index === selectedItemIndex
              ? { ...item, votes_cnt: VotesCnt }
              : item
          ),
          total_votes_cnt: TotalVotesCnt,
          available_votes_cnt: AvailableVotesCnt,
          already_voters: user?.uid,
        });
        setSelectedItemIndex(null);
        // navigate(0);
        setShowAlertConfirm(true);
        setShowAlertVote(false);
        return;
      }
    }
    alert("선택된 index가 없습니다!");
  };

  useEffect(() => {
    fetchVotes();
  }, [id]);

  return (
    <>
      {/* {isShowAlertConfirm ? (
        <>
          <Wrapper>
            <CurrentVote>
              <CurrentTitle>
                오늘의 불개미를 {id} <br />
                투표해주세요.
              </CurrentTitle>
              <Form>
                {vote?.vote_list.map((item, index) => (
                  <VoteItem
                    key={`item${index}`}
                    onClick={() => setSelectedItemIndex(index)}
                    isSelected={selectedItemIndex === index}
                  >
                    {item.name}
                  </VoteItem>
                ))}
              </Form>
            </CurrentVote>
          </Wrapper>
          {selectedItemIndex === null ? (
            <BottomButton01 label={"투표하기"} isDisabled />
          ) : (
            <BottomButton01 label={"투표하기"} onClick={clickVote} />
          )}
        </>
      ) : (
        <Success>
          <SuccessIcon>
            <img
              src="/images/icon/common/icon-check-circle-64.svg"
              alt="체크 아이콘"
              width={64}
              height={64}
            />
          </SuccessIcon>
          <SuccessText> 투표가 완료되었습니다!</SuccessText>
        </Success>
      )} */}

      {isShowAlertConfirm ? (
        // <Success>
        //   <SuccessIcon>
        //     <img
        //       src="/images/icon/common/icon-check-circle-64.svg"
        //       alt="체크 아이콘"
        //       width={64}
        //       height={64}
        //     />
        //   </SuccessIcon>
        //   <SuccessText> 투표가 완료되었습니다!</SuccessText>
        // </Success>
        <Success message={"투표가 완료되었습니다!"} />
      ) : (
        <>
          <Wrapper>
            <CurrentVote>
              <CurrentTitle>
                <b>{id}</b>번째 불개미를 <br />
                투표해주세요.
              </CurrentTitle>
              <Form>
                {vote?.vote_list.map((item, index) => (
                  <VoteItem
                    key={`item${index}`}
                    onClick={() => setSelectedItemIndex(index)}
                    isSelected={selectedItemIndex === index}
                  >
                    {item.name}
                  </VoteItem>
                ))}
              </Form>
            </CurrentVote>
          </Wrapper>
          {selectedItemIndex === null ? (
            <BottomButton01 label={"투표하기"} isDisabled />
          ) : (
            <BottomButton01 label={"투표하기"} onClick={clickVote} />
          )}
        </>
      )}

      {isShowAlertVote && (
        <Alert
          message={"선택한 팀원으로 투표 하시겠습니까?"}
          buttons={[
            <ButtonSecondary
              label={"취소"}
              onClick={() => setShowAlertVote(false)}
              isWidthFull
            />,
            <ButtonPrimary
              label={"투표하기"}
              onClick={onRegister}
              isWidthFull
            />,
          ]}
        />
      )}
      {/* {isShowAlertConfirm && (
        <Alert
          message={"투표가 완료되었습니다!"}
          buttons={[
            <ButtonPrimary label={"확인"} onClick={onRegister} isWidthFull />,
          ]}
        />
      )} */}
    </>
  );
}

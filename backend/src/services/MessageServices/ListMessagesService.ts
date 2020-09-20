import { where, fn, col } from "sequelize";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import FindTicketService from "../TicketServices/FindTicketService";

interface Request {
  ticketId: string;
  searchParam?: string;
  pageNumber?: string;
}

interface Response {
  messages: Message[];
  ticket: Ticket;
  count: number;
  hasMore: boolean;
}

const ListMessagesService = async ({
  searchParam = "",
  pageNumber = "1",
  ticketId
}: Request): Promise<Response> => {
  const whereCondition = {
    body: where(
      fn("LOWER", col("body")),
      "LIKE",
      `%${searchParam.toLowerCase()}%`
    ),
    ticketId
  };

  const ticket = await FindTicketService({ where: { id: +ticketId } });

  if (!ticket) {
    throw new Error("No ticket found with this ID");
  }

  // await setMessagesAsRead(ticket);
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: messages } = await Message.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]]
  });

  const hasMore = count > offset + messages.length;

  return {
    messages: messages.reverse(),
    ticket,
    count,
    hasMore
  };
};

export default ListMessagesService;
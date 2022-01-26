export default {
	name: "comment",
	title: "Comment",
	type: "document",
	fields: [
		{
			name: "name",
			type: "string",
		},
        { 
            title: "approved",
            name: "approved",
            type: "boolean",
            description: "Comments won't show on the side without approvade"
        },
        {
            name: "email",
			type: "string",
        },
        {
            name: "comment",
			type: "text",
        },
        {
            name: "post",
			type: "reference",
            to: [{type: "post"}]
        }
    ]
};

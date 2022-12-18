generate: generate-server generate-client

generate-server:
	~/coding/go/bin/webrpc-gen -schema=rpc.ridl -target=golang -pkg=rpc -server -out=./rpc/rpc.gen.go

generate-client:
	~/coding/go/bin/webrpc-gen -schema=rpc.ridl -target=javascript -client -out=/home/syamil/coding/ecommerce-admin/src/rpc.gen.js